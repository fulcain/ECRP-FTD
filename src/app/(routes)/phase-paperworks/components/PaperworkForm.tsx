"use client";

import { useState } from "react";
import {
  paperworkConfig,
  PhaseKey,
} from "@/app/(routes)/phase-paperworks/lib/paperworkConfig";
import { generateBBCode } from "@/app/(routes)/phase-paperworks/lib/generateBBCode";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PaperworkForm() {
  const [phase, setPhase] = useState<PhaseKey>("introduction");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState<any>({
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
  });

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
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 space-y-8">
      {/* Phase Selection */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Select Phase</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {Object.entries(paperworkConfig).map(([key, value]) => (
            <Button
              key={key}
              variant={phase === key ? "default" : "outline"}
              onClick={() => setPhase(key as PhaseKey)}
            >
              {value.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Session Details */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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

          <div className="grid md:grid-cols-2 gap-6">
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
                  <div className="space-y-4 pl-6 border-l">
                    {form.tenFifteenCalls.map((call: any, index: number) => (
                      <div
                        key={index}
                        className="space-y-4 p-4 border rounded-md bg-muted/30"
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
                          <Textarea
                            className="min-h-[100px]"
                            value={call.performanceNotes}
                            onChange={(e) =>
                              updateTenFifteenCall(
                                index,
                                "performanceNotes",
                                e.target.value,
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
                <Textarea
                  className="min-h-[120px]"
                  value={form.detailedNotes}
                  onChange={(e) => update("detailedNotes", e.target.value)}
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
                  If you want your notes to be in bullet style, check the above
                  and write each note with a [*] at the start of it
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
                <Textarea
                  className="min-h-[120px]"
                  value={form.issues}
                  onChange={(e) => update("issues", e.target.value)}
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
                <Textarea
                  className="min-h-[120px]"
                  value={form.reasonFailure}
                  onChange={(e) => update("reasonFailure", e.target.value)}
                />
              </div>
            </>
          )}

          {/* Notes for Next Training */}
          {phase !== "introduction" && phase !== "certPassed" && (
            <>
              <Separator />
              <div className="space-y-3">
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
                <Textarea
                  className="min-h-[100px]"
                  value={form.notesNextTraining}
                  onChange={(e) => update("notesNextTraining", e.target.value)}
                />
              </div>
            </>
          )}

          <Separator />
          {/* Field Training Session Checkbox */}
          <div className="flex flex-row gap-2 items-center justify-start">
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
              <div className="flex flex-row gap-2 items-center justify-start">
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
              <div className="flex flex-row gap-2 items-center justify-start">
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
              <div className="flex flex-row gap-2 items-center justify-start">
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
              <div className="flex flex-row gap-2 items-center justify-start">
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
              <div className="flex flex-row gap-2 items-center justify-start">
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

      {/* Signature */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Signature</CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Signature</Label>
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
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-4">
        <Button size="lg" onClick={generate}>
          Generate BBCode
        </Button>

        <Button size="lg" variant="secondary" onClick={copyToClipboard}>
          {copied ? "Copied to Clipboard" : "Copy to Clipboard"}
        </Button>
      </div>

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
              className="min-h-[350px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
