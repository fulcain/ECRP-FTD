"use client";

import { useEffect, useState } from "react";
import {
  paperworkConfig,
  PhaseKey,
} from "@/app/(routes)/phase-paperworks/lib/paperworkConfig";
import { generateBBCode } from "@/app/(routes)/phase-paperworks/lib/generateBBCode";
import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { toast, ToastContainer } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BbcodeTextarea } from "@/app/(routes)/phase-paperworks/components/BbcodeTextarea";
import { Save, Copy, Trash2, FileText, Clock, User, Phone, FileCheck, AlertCircle } from "lucide-react";

export default function PaperworkForm() {
  const [phase, setPhase] = useState<PhaseKey>("introduction");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const [ftdDetails, setFtdDetails] = useLocalStorage("ftd-details", {
    signature: "",
    rank: "",
  });

  const initialFormState = {
    timeStarted: "",
    timeEnded: "",
    participated: false,
    tenFifteenCalls: [],
    detailedNotes: "",
    detailedNotesListNone: false,
    issues: "",
    reasonFailure: "",
    signature: "",
    rank: "",
    rideAlongType: "",
    ftsCompleted: false,
    introEmailSent: false,
    passedPreCert: false,
    wasQuizSent: false,
    wasMedicalGiven: false,
    callsign: 0,
    additionalMandatories: "",
    notesNextTraining: "",
  };

  const [form, setForm] = useState<any>(initialFormState);

  // Load saved signature + rank into form on mount
  useEffect(() => {
    if (ftdDetails?.signature || ftdDetails?.rank) {
      setForm((prev: any) => ({
        ...prev,
        signature: ftdDetails.signature,
        rank: ftdDetails.rank,
      }));
    }
  }, []);

  const clearAllFields = () => {
    setForm((prev: any) => ({
      ...initialFormState,
      signature: prev.signature,
      rank: prev.rank,
    }));

    setOutput("");
    setCopied(false);

    toast.info("All fields cleared", { theme: "dark" });
  };

  const saveFtdDetails = () => {
    setFtdDetails({
      signature: form.signature,
      rank: form.rank,
    });
    toast.success("Saved to browser", { theme: "dark" });
  };

  const update = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  // 10-15 helpers
  const addTenFifteenCall = () => {
    update("tenFifteenCalls", [
      ...form.tenFifteenCalls,
      { rating: "", performanceNotes: "" },
    ]);
  };

  const updateTenFifteenCall = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updated = [...form.tenFifteenCalls];
    updated[index][field] = value;
    update("tenFifteenCalls", updated);
  };

  const removeTenFifteenCall = (index: number) => {
    const updated = form.tenFifteenCalls.filter(
      (_: any, i: number) => i !== index,
    );
    update("tenFifteenCalls", updated);
  };

  const config = paperworkConfig[phase];

  const generate = () => {
    const bbcode = generateBBCode(
      form,
      phase,
      config.sections,
      config.image || undefined,
    );
    setOutput(bbcode);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);

    toast.success("Copied!", { theme: "dark" });
  };

  // Helper to check if section should be shown
  const showSection = (section: string) => config.sections.includes(section);

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
        

        {/* FTO Details - Minimal Card */}
        <Card className="border-0 shadow-none bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px] space-y-1.5">
                <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  Signature (image link)
                </Label>
                <Input
                  value={form.signature}
                  onChange={(e) => update("signature", e.target.value)}
                  placeholder="https://i.imgur.com/..."
                  className="bg-background"
                />
              </div>
              <div className="flex-1 min-w-[120px] space-y-1.5">
                <Label className="text-xs text-muted-foreground">Rank</Label>
                <Input
                  value={form.rank}
                  onChange={(e) => update("rank", e.target.value)}
                  placeholder="e.g., Officer"
                  className="bg-background"
                />
              </div>
              <Button 
                onClick={saveFtdDetails} 
                variant="outline" 
                size="sm"
                className="self-end"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Phase Selector - Simplified */}
        <div className="flex gap-1.5 flex-wrap">
          {Object.entries(paperworkConfig).map(([key, value]) => (
            <Button
              key={key}
              variant={phase === key ? "default" : "ghost"}
              size="sm"
              onClick={() => setPhase(key as PhaseKey)}
              className="text-sm font-normal"
            >
              {value.label}
            </Button>
          ))}
        </div>

        {/* Main Form - Clean, minimal sections */}
        <div className="space-y-4">
          {/* Time Section */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Session Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Started</Label>
                <Input
                  value={form.timeStarted}
                  onChange={(e) => update("timeStarted", e.target.value)}
                  placeholder="00:00"
                  className="bg-background"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Ended</Label>
                <Input
                  value={form.timeEnded}
                  onChange={(e) => update("timeEnded", e.target.value)}
                  placeholder="00:00"
                  className="bg-background"
                />
              </div>
            </CardContent>
          </Card>

          {/* Ride Along Type */}
          {showSection("rideAlong") && (
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Ride Along</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={form.rideAlongType}
                  onValueChange={(value) => update("rideAlongType", value)}
                >
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MANDATORY">Mandatory</SelectItem>
                    <SelectItem value="OPTIONAL">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* 10-15 Calls */}
          {showSection("tenFifteen") && (
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  10-15 Calls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="participated"
                    checked={form.participated}
                    onCheckedChange={(val) => {
                      update("participated", val);
                      if (val && form.tenFifteenCalls.length === 0) {
                        update("tenFifteenCalls", [
                          { rating: "", performanceNotes: "" },
                        ]);
                      }
                      if (!val) {
                        update("tenFifteenCalls", []);
                      }
                    }}
                  />
                  <Label htmlFor="participated" className="text-sm cursor-pointer">
                    Participated in 10-15 call
                  </Label>
                </div>

                {form.participated && (
                  <div className="space-y-4 mt-4">
                    {form.tenFifteenCalls.map((call: any, index: number) => (
                      <div key={index} className="bg-muted/20 p-4 rounded-lg space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">
                            Call #{index + 1}
                          </span>
                          {form.tenFifteenCalls.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTenFifteenCall(index)}
                              className="h-7 px-2 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">Rating (1-5)</Label>
                            <Input
                              value={call.rating}
                              onChange={(e) =>
                                updateTenFifteenCall(index, "rating", e.target.value)
                              }
                              placeholder="3"
                              className="bg-background"
                            />
                          </div>
                          <div className="space-y-1.5 sm:col-span-2">
                            <Label className="text-xs text-muted-foreground">Performance Notes</Label>
                            <BbcodeTextarea
                              className="min-h-[80px] bg-background"
                              value={call.performanceNotes}
                              onChange={(value) =>
                                updateTenFifteenCall(index, "performanceNotes", value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTenFifteenCall}
                    >
                      + Add call
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Detailed Notes */}
          {showSection("detailedNotes") && (
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Session Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <BbcodeTextarea
                  className="min-h-[120px] bg-background"
                  value={form.detailedNotes}
                  onChange={(value) => update("detailedNotes", value)}
                  placeholder="Document the training session details..."
                />
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="listNone"
                    checked={form.detailedNotesListNone}
                    onCheckedChange={(val) => update("detailedNotesListNone", val)}
                  />
                  <Label htmlFor="listNone" className="text-xs text-muted-foreground cursor-pointer">
                    Use plain list style (no bullets for the wrapper list)
                  </Label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Issues */}
          {showSection("issues") && (
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  Issues Encountered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BbcodeTextarea
                  className="min-h-[100px] bg-background"
                  value={form.issues}
                  onChange={(value) => update("issues", value)}
                  placeholder="Document any issues or concerns..."
                />
              </CardContent>
            </Card>
          )}

          {/* Failure Reason */}
          {showSection("failedCert") && (
            <Card className="border shadow-sm border-destructive/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-destructive">
                  Certification Failed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BbcodeTextarea
                  className="min-h-[100px] bg-background"
                  value={form.reasonFailure}
                  onChange={(value) => update("reasonFailure", value)}
                  placeholder="Reason for failure..."
                />
              </CardContent>
            </Card>
          )}

          {/* Next Training Notes */}
          {phase !== "introduction" && phase !== "certPassed" && (
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Next Session Focus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Additional Mandatories</Label>
                  <Input
                    value={form.additionalMandatories}
                    onChange={(e) => update("additionalMandatories", e.target.value)}
                    placeholder="0"
                    className="bg-background w-32"
                  />
                </div>
                <div className="space-y-1.5">
                  <BbcodeTextarea
                    className="min-h-[80px] bg-background"
                    value={form.notesNextTraining}
                    onChange={(value) => update("notesNextTraining", value)}
                    placeholder="Topics to cover in next session..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Checkboxes Section - Clean layout */}
          <Card className="border shadow-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ftsCompleted"
                  checked={form.ftsCompleted}
                  onCheckedChange={(val) => update("ftsCompleted", val)}
                />
                <Label htmlFor="ftsCompleted" className="text-sm cursor-pointer">
                  Field Training Session Completed
                </Label>
              </div>

              {phase === "introduction" && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="introEmailSent"
                    checked={form.introEmailSent}
                    onCheckedChange={(val) => update("introEmailSent", val)}
                  />
                  <Label htmlFor="introEmailSent" className="text-sm cursor-pointer">
                    Introduction Email Sent
                  </Label>
                </div>
              )}

              {phase === "preCert" && (
                <>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="passedPreCert"
                      checked={form.passedPreCert}
                      onCheckedChange={(val) => update("passedPreCert", val)}
                    />
                    <Label htmlFor="passedPreCert" className="text-sm cursor-pointer">
                      Pre-Certification Passed
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="wasQuizSent"
                      checked={form.wasQuizSent}
                      onCheckedChange={(val) => update("wasQuizSent", val)}
                    />
                    <Label htmlFor="wasQuizSent" className="text-sm cursor-pointer">
                      Quiz Sent (if failed)
                    </Label>
                  </div>
                </>
              )}

              {phase === "certPassed" && (
                <>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="wasMedicalGiven"
                      checked={form.wasMedicalGiven}
                      onCheckedChange={(val) => update("wasMedicalGiven", val)}
                    />
                    <Label htmlFor="wasMedicalGiven" className="text-sm cursor-pointer">
                      Medical License Given
                    </Label>
                  </div>
                  <div className="flex items-start flex-col gap-1">
										<div className="flex items-center flex-row gap-1">
											<Label htmlFor="callsign" className="text-sm">Call Sign:</Label>
											<Input
												id="callsign"
												className="w-24 h-8"
												placeholder="Number"
												value={form.callsign}
												onChange={(e) => update("callsign", e.target.value)}
											/>

										</div>

																				                <span className="text-xs text-muted-foreground">(Only put the number. ex: 12 - it will out put ECHO-12)</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Bar - Floating at bottom on mobile, inline on desktop */}
        <div className="sticky bottom-4 bg-background/95 backdrop-blur-sm border rounded-lg p-3 flex gap-2 justify-center md:justify-start shadow-lg">
          <Button onClick={generate} size="sm" className="px-6">
            <FileCheck className="h-4 w-4 mr-2" />
            Generate
          </Button>
          <Button
            disabled={!output}
            variant="secondary"
            size="sm"
            onClick={copyToClipboard}
            className="px-6"
          >
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFields}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Output */}
        {output && (
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Generated BBCode</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={output}
                readOnly
                className="min-h-[300px] font-mono text-sm bg-background"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
