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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BbcodeTextarea } from "@/app/(routes)/phase-paperworks/components/BbcodeTextarea";

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

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      <div className="max-w-6xl mx-auto py-8 px-4 md:px-6 space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Saved FTO Details</CardTitle>
            <CardDescription>
              These are reused every time you open the form.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <div className="flex flex-row gap-1">
                <Label>Signature</Label>

                <span className="text-sm text-gray-400">
                  (Provide a link only)
                </span>
              </div>
              <Input
                value={form.signature}
                onChange={(e) => update("signature", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Rank</Label>
              <Input
                value={form.rank}
                onChange={(e) => update("rank", e.target.value)}
              />
            </div>

            <Button className="md:w-auto w-full" onClick={saveFtdDetails}>
              Save to Browser
            </Button>
          </CardContent>
        </Card>

        {/* Phase Selection */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Select Phase</CardTitle>
            <CardDescription>
              Pick the training milestone before filling out details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Current phase:{" "}
              <span className="font-medium text-foreground">
                {config.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(paperworkConfig).map(([key, value]) => (
                <Button
                  key={key}
                  variant={phase === key ? "default" : "outline"}
                  onClick={() => setPhase(key as PhaseKey)}
                >
                  {value.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Session Details */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
            <CardDescription>
              Fill in the session timeline and any phase-specific notes below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Ride Along */}
            {config.sections.includes("rideAlong") && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label>Ride Along Type</Label>
                  <Select
                    value={form.rideAlongType}
                    onValueChange={(value) => update("rideAlongType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ride along type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANDATORY">Mandatory</SelectItem>
                      <SelectItem value="OPTIONAL">Optional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Time Started</Label>
                <Input
                  value={form.timeStarted}
                  onChange={(e) => update("timeStarted", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Time Ended</Label>
                <Input
                  value={form.timeEnded}
                  onChange={(e) => update("timeEnded", e.target.value)}
                />
              </div>
            </div>

            {/* 10-15 Section */}
            {config.sections.includes("tenFifteen") && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
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
                    <Label className="cursor-pointer">
                      Participated in 10-15 call
                    </Label>
                  </div>

                  {form.participated && (
                    <div className="space-y-4 pl-4 border-l-2 border-border">
                      {form.tenFifteenCalls.map((call: any, index: number) => (
                        <div
                          key={index}
                          className="space-y-4 p-4 border rounded-lg bg-muted/20"
                        >
                          <div className="flex justify-between items-center">
                            <Label className="font-semibold">
                              10-15 Call #{index + 1}
                            </Label>
                            {form.tenFifteenCalls.length > 1 && (
                              <Button
                                variant="destructive"
                                size="sm"
                                type="button"
                                onClick={() => removeTenFifteenCall(index)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>Rating (1-5)</Label>
                            <Input
                              value={call.rating}
                              onChange={(e) =>
                                updateTenFifteenCall(
                                  index,
                                  "rating",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Performance Notes</Label>
                            <BbcodeTextarea
                              className="min-h-[100px]"
                              value={call.performanceNotes}
                              onChange={(value) =>
                                updateTenFifteenCall(
                                  index,
                                  "performanceNotes",
                                  value,
                                )
                              }
                            />
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="secondary"
                        onClick={addTenFifteenCall}
                      >
                        + Add Another 10-15 Call
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Detailed Notes */}
            {config.sections.includes("detailedNotes") && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label>Detailed Notes</Label>
                  <BbcodeTextarea
                    className="min-h-[140px]"
                    value={form.detailedNotes}
                    onChange={(value) => update("detailedNotes", value)}
                  />

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={form.detailedNotesListNone || false}
                      onCheckedChange={(val) =>
                        update("detailedNotesListNone", val)
                      }
                    />
                    <Label className="cursor-pointer">
                      Use default list style (checked = [list=none])
                    </Label>
                  </div>

                  <span className="text-sm text-gray-400">
                    If you do not want bullet-style notes, check the box above.
                  </span>
                </div>
              </>
            )}

            {/* Issues */}
            {config.sections.includes("issues") && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label>Issues</Label>
                  <BbcodeTextarea
                    className="min-h-[140px]"
                    value={form.issues}
                    onChange={(value) => update("issues", value)}
                  />
                </div>
              </>
            )}

            {/* Failed Certification */}
            {config.sections.includes("failedCert") && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label>Reason for Failure</Label>
                  <BbcodeTextarea
                    className="min-h-[140px]"
                    value={form.reasonFailure}
                    onChange={(value) => update("reasonFailure", value)}
                  />
                </div>
              </>
            )}

            {/* Notes for Next Training */}
            {phase !== "introduction" && phase !== "certPassed" && (
              <>
                <Separator />
                <div className="space-y-3 rounded-lg border p-4">
                  <div className="flex flex-col gap-1">
                    <Label>Additional Mandatories Given</Label>
                    <span className="text-sm text-gray-400">default to 0</span>
                  </div>
                  <Input
                    value={form.additionalMandatories}
                    onChange={(e) =>
                      update("additionalMandatories", e.target.value)
                    }
                  />

                  <Label>Subjects to Focus During Next Training Session</Label>
                  <BbcodeTextarea
                    className="min-h-[100px]"
                    value={form.notesNextTraining}
                    onChange={(value) => update("notesNextTraining", value)}
                  />
                </div>
              </>
            )}

            <Separator />
            {/* Field Training Session Checkbox */}
            <div className="flex flex-row gap-2 items-center justify-start rounded-md px-1 py-1">
              <Label className="cursor-pointer">
                Field Training Session Completed
              </Label>
              <Checkbox
                checked={form.ftsCompleted}
                onCheckedChange={(val) => update("ftsCompleted", val)}
              />
            </div>
            <Separator />
            {/* introduction email sent Checkbox */}
            {phase === "introduction" && (
              <>
                <div className="flex flex-row gap-2 items-center justify-start rounded-md px-1 py-1">
                  <Label className="cursor-pointer">
                    Introduction email sent Completed
                  </Label>
                  <Checkbox
                    checked={form.introEmailSent}
                    onCheckedChange={(val) => update("introEmailSent", val)}
                  />
                </div>
                <Separator />
              </>
            )}
            {/* Pre Cert Passed */}
            {phase === "preCert" && (
              <>
                <div className="flex flex-row gap-2 items-center justify-start rounded-md px-1 py-1">
                  <Label className="cursor-pointer">Pre Cert Passed</Label>
                  <Checkbox
                    checked={form.passedPreCert}
                    onCheckedChange={(val) => update("passedPreCert", val)}
                  />
                </div>
                <Separator />
              </>
            )}
            {/* Quiz sent */}
            {phase === "preCert" && (
              <>
                <div className="flex flex-row gap-2 items-center justify-start rounded-md px-1 py-1">
                  <Label className="cursor-pointer">Was the quiz sent?</Label>
                  <span className="text-sm text-gray-400">
                    Only check this if they failed their Pre-Certification
                  </span>

                  <Checkbox
                    checked={form.wasQuizSent}
                    onCheckedChange={(val) => update("wasQuizSent", val)}
                  />
                </div>
                <Separator />
              </>
            )}

            {/* Medical License */}
            {phase === "certPassed" && (
              <>
                <div className="flex flex-row gap-2 items-center justify-start rounded-md px-1 py-1">
                  <Label className="cursor-pointer">
                    Was the medical license given? (( /givemedical ))
                  </Label>

                  <Checkbox
                    checked={form.wasMedicalGiven}
                    onCheckedChange={(val) => update("wasMedicalGiven", val)}
                  />
                </div>
                <Separator />
              </>
            )}

            {/* Medical License */}
            {phase === "certPassed" && (
              <>
                <div className="flex flex-row gap-2 items-center justify-start rounded-md px-1 py-1">
                  <Label className="cursor-pointer">Call sign:</Label>

                  <Input
                    className="max-w-40"
                    placeholder="Enter a number"
                    value={form.callsign}
                    onChange={(e) => update("callsign", e.target.value)}
                  />
                </div>
                <Separator />
              </>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>
              Generate your BBCode output, then copy it to clipboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={generate}>
                Generate BBCode
              </Button>

              <Button
                disabled={!output}
                size="lg"
                variant="secondary"
                onClick={copyToClipboard}
              >
                {copied ? "Copied to Clipboard" : "Copy to Clipboard"}
              </Button>

              <Button
                size="lg"
                variant="destructive"
                type="button"
                onClick={clearAllFields}
              >
                Clear All Fields
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output */}
        {output && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Generated BBCode</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={output}
                readOnly
                className="min-h-[350px] font-mono text-sm leading-relaxed"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
