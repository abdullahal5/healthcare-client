"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Activity, User, Weight } from "lucide-react";

interface BMIResult {
  value: number;
  category: string;
  color: string;
  description: string;
}

export default function BMICalculator() {
  const [height, setHeight] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [bmiResult, setBmiResult] = useState<BMIResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const getBMICategory = (bmi: number): Omit<BMIResult, "value"> => {
    if (bmi < 18.5) {
      return {
        category: "Underweight",
        color: "bg-blue-500",
        description: "Below normal weight range",
      };
    } else if (bmi < 25) {
      return {
        category: "Normal",
        color: "bg-green-500",
        description: "Healthy weight range",
      };
    } else if (bmi < 30) {
      return {
        category: "Overweight",
        color: "bg-yellow-500",
        description: "Above normal weight range",
      };
    } else {
      return {
        category: "Obese",
        color: "bg-red-500",
        description: "Significantly above normal weight",
      };
    }
  };

  const calculateBMI = () => {
    if (!height || !weight) return;

    setIsCalculating(true);

    setTimeout(() => {
      let heightInMeters: number;
      let weightInKg: number;

      // Convert height to meters
      if (heightUnit === "cm") {
        heightInMeters = Number.parseFloat(height) / 100;
      } else {
        // Convert feet to meters (assuming format like "5.8" for 5'8")
        heightInMeters = Number.parseFloat(height) * 0.3048;
      }

      // Convert weight to kg
      if (weightUnit === "kg") {
        weightInKg = Number.parseFloat(weight);
      } else {
        weightInKg = Number.parseFloat(weight) * 0.453592;
      }

      const bmi = weightInKg / (heightInMeters * heightInMeters);
      const category = getBMICategory(bmi);

      setBmiResult({
        value: bmi,
        ...category,
      });
      setIsCalculating(false);
    }, 500);
  };

  const resetCalculator = () => {
    setHeight("");
    setWeight("");
    setBmiResult(null);
  };

  const BMIScale = () => (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground mb-3">
        BMI Scale Reference
      </div>
      <div className="space-y-2">
        {[
          { range: "< 18.5", category: "Underweight", color: "bg-blue-500" },
          { range: "18.5 - 24.9", category: "Normal", color: "bg-green-500" },
          {
            range: "25.0 - 29.9",
            category: "Overweight",
            color: "bg-yellow-500",
          },
          { range: "≥ 30.0", category: "Obese", color: "bg-red-500" },
        ].map((item, index) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-sm font-medium">{item.category}</span>
            </div>
            <span className="text-sm text-muted-foreground">{item.range}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">BMI Calculator</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Calculate your Body Mass Index (BMI) to assess if you&apos;re in a
            healthy weight range. This tool is designed for healthcare
            professionals and patients.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-lg bg-white/80 border border-neutral-300 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  Patient Information
                </CardTitle>
                <CardDescription>
                  Enter the patient&apos;s height and weight to calculate BMI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Height Input */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-base font-medium">
                    <User className="h-4 w-4" />
                    Height
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder={heightUnit === "cm" ? "170" : "5.8"}
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="text-lg h-12 border border-neutral-300"
                      />
                    </div>
                    <div className="flex rounded-lg border">
                      <Button
                        type="button"
                        variant={heightUnit === "cm" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setHeightUnit("cm")}
                        className="rounded-r-none border border-neutral-300"
                      >
                        cm
                      </Button>
                      <Button
                        type="button"
                        variant={heightUnit === "ft" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setHeightUnit("ft")}
                        className="rounded-l-none border border-neutral-300"
                      >
                        ft
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Weight Input */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-base font-medium">
                    <Weight className="h-4 w-4" />
                    Weight
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder={weightUnit === "kg" ? "70" : "154"}
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="text-lg h-12 border border-neutral-300"
                      />
                    </div>
                    <div className="flex rounded-lg border">
                      <Button
                        type="button"
                        variant={weightUnit === "kg" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setWeightUnit("kg")}
                        className="rounded-r-none border border-neutral-300"
                      >
                        kg
                      </Button>
                      <Button
                        type="button"
                        variant={weightUnit === "lbs" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setWeightUnit("lbs")}
                        className="rounded-l-none border border-neutral-300"
                      >
                        lbs
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={calculateBMI}
                    disabled={!height || !weight || isCalculating}
                    className="flex-1 h-12 text-lg"
                  >
                    {isCalculating ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      "Calculate BMI"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetCalculator}
                    className="h-12 bg-transparent border border-neutral-300"
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* BMI Result */}
            <Card className="shadow-lg border border-neutral-300 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle>BMI Result</CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {bmiResult ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-center space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="text-4xl font-bold text-gray-900">
                          {bmiResult.value.toFixed(1)}
                        </div>
                        <Badge
                          className={`${bmiResult.color} text-white px-3 py-1 text-sm`}
                        >
                          {bmiResult.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {bmiResult.description}
                      </p>

                      {/* Visual BMI Indicator */}
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(
                                (bmiResult.value / 40) * 100,
                                100
                              )}%`,
                            }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full ${bmiResult.color} rounded-full`}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0</span>
                          <span>40+</span>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Enter height and weight to calculate BMI</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* BMI Scale Reference */}
            <Card className="shadow-lg border border-neutral-300 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">BMI Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <BMIScale />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
