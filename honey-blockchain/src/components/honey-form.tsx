"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { blockchainService, BlockchainService } from "@/lib/blockchain";
import { useWallet } from "@/lib/wallet-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Upload,
  Wallet,
  CheckCircle,
  AlertTriangle,
  LogOut,
  User,
  Shield,
  Search,
  QrCode,
} from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  beekeeperName: z
    .string()
    .min(2, "Beekeeper name must be at least 2 characters"),
  region: z.string().min(1, "Please select a region"),
  flowerType: z.string().min(1, "Please select a flower type"),
  harvestDate: z.string().min(1, "Harvest date is required"),
  description: z.string().optional(),
  batchId: z.string().optional(),
  qrCode: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const flowerTypes = [
  { value: "sidr", label: "Sidr", region: "Yemen & Gulf" },
  { value: "acacia", label: "Acacia", region: "Yemen" },
  { value: "wildflower", label: "Wildflower", region: "General" },
  { value: "orange-blossom", label: "Orange Blossom", region: "Coastal Areas" },
  {
    value: "mountain-herbs",
    label: "Mountain Herbs",
    region: "Mountain Areas",
  },
  { value: "manuka", label: "Manuka", region: "New Zealand" },
  { value: "lavender", label: "Lavender", region: "Mediterranean" },
  { value: "clover", label: "Clover", region: "General" },
  { value: "other", label: "Other", region: "Specify in description" },
];

const regions = [
  "Sana'a, Yemen",
  "Aden, Yemen",
  "Taiz, Yemen",
  "Ibb, Yemen",
  "Hodeidah, Yemen",
  "Hadramout, Yemen",
  "Socotra, Yemen",
  "California, USA",
  "New Zealand",
  "Australia",
  "Mediterranean Region",
  "Other",
];

export function HoneyForm() {
  const router = useRouter();
  const { account, isConnected, connectWallet } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [farmerLoggedIn, setFarmerLoggedIn] = useState(false);
  const [farmerUsername, setFarmerUsername] = useState("");

  const handleLogout = () => {
    sessionStorage.removeItem("farmerLoggedIn");
    sessionStorage.removeItem("farmerUsername");
    router.push("/farmer-login");
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      beekeeperName: "",
      region: "",
      flowerType: "",
      harvestDate: "",
      description: "",
      batchId: "",
      qrCode: "",
    },
  });

  useEffect(() => {
    // Check farmer login
    if (typeof window !== "undefined") {
      const loggedIn = sessionStorage.getItem("farmerLoggedIn");
      const username = sessionStorage.getItem("farmerUsername");
      if (loggedIn === "true" && username) {
        setFarmerLoggedIn(true);
        setFarmerUsername(username);
      } else {
        router.push("/farmer-login");
      }
    }
  }, [router]);

  // ⛳ HERE IS THE FIXED onSubmit inside the component
  const onSubmit = async (data: FormData) => {
    if (!farmerLoggedIn) {
      setSubmitError("Please login as a farmer first");
      return;
    }

    if (!isConnected) {
      setSubmitError("Please connect MetaMask wallet first");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const displayId = data.batchId || BlockchainService.generateBatchId();
      const batchData = {
        beekeeperName: data.beekeeperName,
        region: data.region,
        flowerType: data.flowerType,
        harvestDate: data.harvestDate,
        description: data.description || "",
        displayId,
      };

      // Create batch on blockchain
      const txHash = await blockchainService.createHoneyBatch(batchData);

      // Save to database
      const dbResponse = await fetch('/api/honey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batchId: displayId,
          beekeeperName: data.beekeeperName,
          harvestDate: data.harvestDate,
          flowerType: data.flowerType,
          description: data.description || "",
          region: data.region,
          qrCodeUrl: `${window.location.origin}/verify?id=${displayId}`,
        }),
      });

      if (!dbResponse.ok) {
        console.error('Failed to save to database:', await dbResponse.text());
        // Continue anyway since blockchain transaction succeeded
      }

      const successData = {
        ...batchData,
        walletAddress: account,
        timestamp: new Date().toISOString(),
        blockchainTxHash: txHash,
        farmer: account,
      };

      sessionStorage.setItem("honeyBatch", JSON.stringify(successData));
      router.push("/success");
    } catch (err: unknown) {
      console.error(err);

      if (err instanceof Error) {
        setSubmitError(err.message || "Blockchain transaction failed");
      } else {
        setSubmitError("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header Card */}
          <Card className="shadow-xl mb-8">
            <CardHeader className="text-center bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-t-lg">
              <div className="text-4xl mb-4">🍯</div>
              <CardTitle className="text-3xl">Add Honey Batch</CardTitle>
              <CardDescription className="text-amber-100 text-lg">
                Record your honey batch information on the blockchain
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Status Card - Combined Farmer and Wallet Status */}
          <Card className="shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Farmer Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-amber-600" />
                    <div>
                      <h3 className="font-semibold text-sm">Farmer</h3>
                      <p className="text-xs text-gray-600">
                        {farmerLoggedIn ? farmerUsername : "Not Logged In"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {farmerLoggedIn ? (
                      <>
                        <Badge className="bg-green-600 text-white text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Authenticated
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleLogout}
                          className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white text-xs"
                        >
                          <LogOut className="h-3 w-3 mr-1" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-amber-600 text-xs"
                      >
                        Not Logged In
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Wallet Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-amber-600" />
                    <div>
                      <h3 className="font-semibold text-sm">Wallet</h3>
                      <p className="text-xs text-gray-600">
                        {isConnected ? "Connected" : "Not Connected"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isConnected ? (
                      <Badge className="bg-green-600 text-white text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {account.slice(0, 6)}...{account.slice(-4)}
                      </Badge>
                    ) : (
                      <Button
                        onClick={connectWallet}
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
                      >
                        <Wallet className="h-3 w-3 mr-1" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-amber-700 flex items-center gap-2">
                🍯 Honey Batch Information
              </CardTitle>
              <CardDescription>
                Please fill all required information accurately. This
                information will be permanently stored on the blockchain and can
                be verified by customers.
              </CardDescription>

              {/* Information Box */}
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Blockchain Security
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div>
                    <p className="font-medium">🔒 Immutable Record</p>
                    <p>
                      Once submitted, this information cannot be altered or
                      deleted
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">🌐 Public Verification</p>
                    <p>
                      Customers can verify this honey’s authenticity using the
                      batch ID
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">👨‍🌾 Farmer Authentication</p>
                    <p>
                      Your wallet address will be permanently linked to this
                      batch
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">📱 QR Code Generation</p>
                    <p>
                      A unique QR code will be generated for easy verification
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!farmerLoggedIn && (
                <Alert className="mb-6 border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    You must login as a farmer to record honey information on
                    the blockchain.
                  </AlertDescription>
                </Alert>
              )}

              {!isConnected && (
                <Alert className="mb-6 border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    You must connect your MetaMask wallet to record honey
                    information on the blockchain.
                    <Button
                      onClick={connectWallet}
                      size="sm"
                      className="ml-2 bg-amber-600 hover:bg-amber-700"
                    >
                      Connect Now
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="beekeeperName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beekeeper Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Your full name as it appears on official documents.
                          This will be visible to customers.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Region *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a region" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {regions.map((region) => (
                              <SelectItem key={region} value={region}>
                                {region}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The geographical region where the honey was harvested.
                          This helps customers understand the honey’s origin.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="flowerType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Flower Type *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a flower type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {flowerTypes.map((flower) => (
                              <SelectItem
                                key={flower.value}
                                value={flower.value}
                              >
                                {flower.label} ({flower.region})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The primary flower source for the honey. This
                          determines the honey’s flavor profile and
                          characteristics.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="harvestDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harvest Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          The date when the honey was harvested from the hives.
                          This helps track freshness and seasonal
                          characteristics.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional information about this honey batch (optional)"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include any special notes about the honey, processing
                          methods, or unique characteristics.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Batch ID Field */}
                  <FormField
                    control={form.control}
                    name="batchId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batch ID</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              placeholder="HNY2025-XXX (auto-generated)"
                              {...field}
                              readOnly
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const newBatchId =
                                  BlockchainService.generateBatchId();
                                field.onChange(newBatchId);
                              }}
                              className="whitespace-nowrap"
                            >
                              Generate
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Unique identifier for this honey batch. Click
                          ”Generate” to create a new batch ID.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* QR Code Field */}
                  <FormField
                    control={form.control}
                    name="qrCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>QR Code URL</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Verification URL (auto-generated)"
                              {...field}
                              readOnly
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                const batchId =
                                  form.getValues("batchId") ||
                                  BlockchainService.generateBatchId();
                                const qrUrl = `${window.location.origin}/verify?id=${batchId}`;
                                field.onChange(qrUrl);
                              }}
                              className="whitespace-nowrap"
                            >
                              Generate
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          QR code URL for customers to verify this honey batch.
                          Click ”Generate” to create the verification link.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {submitError && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting || !isConnected || !farmerLoggedIn}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Recording on Blockchain...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Record Honey Batch
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
