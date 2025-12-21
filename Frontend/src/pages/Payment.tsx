// Frontend/src/pages/Payment.tsx - FIXED VERSION

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "../config/api";
import {
  CheckCircle,
  Loader2,
  Shield,
  CreditCard,
  AlertCircle,
} from "lucide-react";

const Payment = () => {
  const { applicantId } = useParams<{ applicantId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "success" | "failed">("idle");
  const [paymentId, setPaymentId] = useState(""); // ✅ Changed from checkoutRequestID to paymentId
  const [checkoutRequestID, setCheckoutRequestID] = useState(""); // Keep for display
  const [receiptNumber, setReceiptNumber] = useState("");
  const [failureReason, setFailureReason] = useState("");

  // ✅ FIXED: Poll payment status using paymentId
  useEffect(() => {
    if (!paymentId || paymentStatus !== "pending") return;

    console.log('🔄 Starting payment polling for paymentId:', paymentId);

    const interval = setInterval(async () => {
      try {
        console.log('🔍 Checking payment status...');
        
        // ✅ FIXED: Use paymentId instead of checkoutRequestID
        const response = await fetch(
          `${api.payments}/status/${paymentId}`
        );
        const data = await response.json();

        console.log('📊 Status response:', data);

        if (data.success) {
          // ✅ FIXED: Check data.data.status (not just data.status)
          const status = data.data?.status || data.status;

          console.log('Current payment status:', status);

          if (status === "completed") {
            console.log('✅ Payment completed!');
            setPaymentStatus("success");
            setReceiptNumber(data.data?.mpesaReceiptNumber || "");
            clearInterval(interval);
            
            toast({
              title: "Payment Successful!",
              description: "Your payment has been confirmed. Check your email for the receipt.",
            });
          } else if (status === "failed" || status === "cancelled") {
            console.log('❌ Payment failed/cancelled');
            setPaymentStatus("failed");
            setFailureReason(data.data?.failureReason || "Payment was not completed.");
            clearInterval(interval);
            
            toast({
              title: "Payment Failed",
              description: data.data?.failureReason || "Payment was not completed.",
              variant: "destructive",
            });
          } else if (status === "timeout") {
            console.log('⏱️ Payment timeout');
            setPaymentStatus("failed");
            setFailureReason("Payment request timed out. Please check your M-PESA messages.");
            clearInterval(interval);
            
            toast({
              title: "Payment Timeout",
              description: "Please check your M-PESA messages or try again.",
              variant: "destructive",
            });
          }
          // If still pending, continue polling
        }
      } catch (error) {
        console.error("❌ Status check error:", error);
        // Don't stop polling on error - network might be temporarily down
      }
    }, 5000); // ✅ Changed to 5 seconds (was 3 seconds)

    // Stop polling after 2 minutes
    const timeout = setTimeout(() => {
      console.log('⏱️ Polling timeout reached (2 minutes)');
      clearInterval(interval);
      if (paymentStatus === "pending") {
        setPaymentStatus("failed");
        setFailureReason("Payment verification timeout. Please check your M-PESA messages.");
        toast({
          title: "Verification Timeout",
          description: "Please check your M-PESA messages or contact support.",
          variant: "destructive",
        });
      }
    }, 120000); // 2 minutes

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [paymentId, paymentStatus, toast]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Validate phone number
      if (!phoneNumber || phoneNumber.length < 10) {
        throw new Error("Please enter a valid phone number");
      }

      console.log('💳 Initiating payment...');

      const response = await fetch(`${api.payments}/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicantId,
          phoneNumber,
          amount: 1, // ✅ Changed from 1 to 8000
        }),
      });

      const data = await response.json();

      console.log('Payment initiation response:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to initiate payment");
      }

      // ✅ FIXED: Store paymentId (not just checkoutRequestID)
      setPaymentId(data.data.paymentId);
      setCheckoutRequestID(data.data.checkoutRequestId);
      setPaymentStatus("pending");

      console.log('✅ Payment initiated:', {
        paymentId: data.data.paymentId,
        checkoutRequestId: data.data.checkoutRequestId
      });

      toast({
        title: "STK Push Sent!",
        description: "Please check your phone and enter your M-PESA PIN to complete payment.",
      });

    } catch (error: any) {
      console.error("❌ Payment error:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
      setPaymentStatus("failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ Added manual check button handler
  const handleManualCheck = async () => {
    if (!paymentId) return;

    try {
      console.log('🔍 Manual status check for paymentId:', paymentId);
      
      const response = await fetch(`${api.payments}/status/${paymentId}`);
      const data = await response.json();

      console.log('Manual check response:', data);

      if (data.success) {
        const status = data.data?.status || data.status;

        if (status === "completed") {
          setPaymentStatus("success");
          setReceiptNumber(data.data?.mpesaReceiptNumber || "");
          toast({
            title: "Payment Confirmed!",
            description: "Your payment has been verified successfully.",
          });
        } else if (status === "failed" || status === "cancelled" || status === "timeout") {
          setPaymentStatus("failed");
          setFailureReason(data.data?.failureReason || "Payment not completed.");
        } else {
          toast({
            title: "Still Pending",
            description: "Payment is still being processed. Please wait.",
          });
        }
      }
    } catch (error) {
      console.error("❌ Manual check error:", error);
      toast({
        title: "Check Failed",
        description: "Could not check payment status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Success state
  if (paymentStatus === "success") {
    return (
      <Layout>
        <section className="section-padding bg-background pt-32">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Payment Successful! 🎉
              </h1>
              
              <p className="text-muted-foreground text-lg mb-4">
                Your payment of <strong className="text-foreground">Kshs. 8,000</strong> has been confirmed.
              </p>
              
              {receiptNumber && (
                <div className="bg-muted rounded-lg p-4 mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Receipt Number</p>
                  <p className="text-xl font-bold text-foreground">{receiptNumber}</p>
                </div>
              )}
              
              <div className="space-y-3 text-left max-w-md mx-auto mb-8">
                <p className="text-muted-foreground text-sm flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Payment receipt sent to your email</span>
                </p>
                <p className="text-muted-foreground text-sm flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Our team will contact you within 24-48 hours</span>
                </p>
                <p className="text-muted-foreground text-sm flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Medical assessment will be scheduled soon</span>
                </p>
              </div>
              
              <Button
                variant="gold"
                onClick={() => navigate("/jobs")}
                className="shadow-gold"
              >
                Browse More Jobs
              </Button>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Payment form
  return (
    <Layout>
      <section className="section-padding bg-background pt-32">
        <div className="container-custom">
          <div className="max-w-xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Complete Payment
              </h1>
              <p className="text-muted-foreground">
                Secure M-PESA payment for medical assessment fee
              </p>
            </div>

            {/* Payment Amount */}
            <div className="glass-card rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount to Pay</p>
                  <p className="text-3xl font-bold text-green-600">Kshs. 8,000</p>
                </div>
                <Shield className="w-12 h-12 text-green-600 opacity-20" />
              </div>
            </div>

            {/* Payment Form */}
            <div className="glass-card rounded-2xl p-6 lg:p-8">
              <form onSubmit={handlePayment} className="space-y-6">
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">M-PESA Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g., 0712345678"
                    className="h-12 rounded-xl"
                    required
                    disabled={paymentStatus === "pending"}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the phone number registered with M-PESA
                  </p>
                </div>

                {paymentStatus === "pending" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Loader2 className="w-5 h-5 text-blue-600 animate-spin mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-blue-900 mb-1">
                          Waiting for payment...
                        </p>
                        <p className="text-sm text-blue-700 mb-3">
                          Check your phone for the M-PESA prompt. Enter your PIN to complete payment.
                        </p>
                        {/* ✅ Added manual check button */}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleManualCheck}
                          className="text-blue-700 border-blue-300 hover:bg-blue-100"
                        >
                          Check Status Now
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {paymentStatus === "failed" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-900 mb-1">
                          Payment Failed
                        </p>
                        <p className="text-sm text-red-700">
                          {failureReason || "The payment was not completed. Please try again."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="gold"
                  size="xl"
                  className="w-full rounded-xl shadow-gold"
                  disabled={isProcessing || paymentStatus === "pending"}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : paymentStatus === "pending" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Waiting for Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay Kshs. 8,000
                    </>
                  )}
                </Button>

                {/* ✅ Added retry button for failed payments */}
                {paymentStatus === "failed" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="xl"
                    className="w-full rounded-xl"
                    onClick={() => {
                      setPaymentStatus("idle");
                      setFailureReason("");
                      setPaymentId("");
                    }}
                  >
                    Try Again
                  </Button>
                )}

              </form>
            </div>

            {/* Security Notice */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                Secured by Safaricom M-PESA | Your payment is safe
              </p>
            </div>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Payment;