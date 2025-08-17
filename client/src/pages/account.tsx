import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Calendar, Coins, Crown, Settings, LogOut } from "lucide-react";
import {
    useDynamicContext,
    useIsLoggedIn,
    useUserWallets,
    useDynamicWaas,
    useOpenFundingOptions,
    useOnramp,
} from "@dynamic-labs/sdk-react-core";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Apple, CreditCard, Wallet as WalletIcon } from "lucide-react";

function PaymentMethodModal({
    isOpen,
    onClose,
    onSelect,
    amount
}: {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (method: 'APPLE_PAY' | 'CREDIT_CARD') => void;
    amount: number;
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-card-bg border-card-border max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white text-xl font-bold text-center">
                        Choose Payment Method
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 text-center">
                        Select how you'd like to pay for {amount} USDC
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-6">
                    {/* Apple Pay Option */}
                    <button
                        onClick={() => onSelect('APPLE_PAY')}
                        className="w-full p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl border border-blue-500/30 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                    <Apple className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="text-left">
                                    <div className="text-white font-semibold text-lg">Apple Pay</div>
                                    <div className="text-blue-100 text-sm">Fast & Secure</div>
                                </div>
                            </div>
                            <div className="text-white text-2xl font-bold">${amount}</div>
                        </div>
                        <div className="mt-3 text-blue-100 text-xs text-center">
                            ⭐ Recommended - Instant processing
                        </div>
                    </button>

                    {/* Credit Card Option */}
                    <button
                        onClick={() => onSelect('CREDIT_CARD')}
                        className="w-full p-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl border border-gray-600/30 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-gray-600" />
                                </div>
                                <div className="text-left">
                                    <div className="text-white font-semibold text-lg">Credit Card</div>
                                    <div className="text-gray-300 text-sm">Traditional</div>
                                </div>
                            </div>
                            <div className="text-white text-2xl font-bold">${amount}</div>
                        </div>
                        <div className="mt-3 text-gray-300 text-xs text-center">
                            💳 All major cards accepted
                        </div>
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// User Profile Component that uses Dynamic Labs data
function UserProfile() {
    const { user, handleLogOut, setShowAuthFlow } = useDynamicContext();
    const isLoggedIn = useIsLoggedIn();
    const userWallets = useUserWallets();
    const { createWalletAccount } = useDynamicWaas();
    const { openFundingOptions } = useOpenFundingOptions();
    const { open: openOnramp } = useOnramp();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        profileImageUrl: ""
    });
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Update form data when user data changes
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                profileImageUrl: ""
            });
        }
    }, [user]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            console.log("Saving profile:", formData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                profileImageUrl: ""
            });
        }
        setIsEditing(false);
    };

    const handleLogout = async () => {
        try {
            await handleLogOut();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // If not logged in, show login prompt
    if (!isLoggedIn || !user) {
        return (
            <div className="min-h-screen bg-bg-primary text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Account Details</h1>
                    <p className="text-gray-400 mb-8">Please connect your wallet to view your account</p>
                    <Button
                        onClick={() => setShowAuthFlow(true)}
                        className="bg-gradient-to-r from-accent-blue to-accent-purple hover:shadow-lg transition-all px-8 py-3"
                    >
                        <WalletIcon className="w-5 h-5 mr-2" />
                        Connect Wallet
                    </Button>
                </div>
            </div>
        );
    }

    // Get user's display name
    const displayName = user.firstName || user.username || user.email?.split('@')[0] || 'User';
    const userInitial = displayName.charAt(0).toUpperCase();

    return (
        <div className="min-h-screen bg-bg-primary text-white">
            {/* Header */}
            <div className="bg-card-bg border-b border-card-border px-4 py-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold">Account Details</h1>
                    <p className="text-gray-400 mt-2">Manage your profile and settings</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <Card className="bg-card-bg border-card-border">
                            <CardHeader className="text-center pb-4">
                                <CardTitle className="text-white">Profile</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Avatar */}
                                <div className="flex justify-center">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src="" alt="Profile" />
                                        <AvatarFallback className="bg-accent-blue text-white text-2xl">
                                            {userInitial}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                {/* User Info */}
                                <div className="text-center space-y-2">
                                    <h3 className="text-xl font-semibold">
                                        {displayName}
                                    </h3>
                                    <p className="text-gray-400">{user.email}</p>

                                    {/* Wallet Address */}
                                    {userWallets && userWallets.length > 0 && (
                                        <div className="flex items-center justify-center space-x-2 text-gray-300 text-sm">
                                            <WalletIcon className="w-4 h-4" />
                                            <span className="font-mono">
                                                {userWallets[0].address.slice(0, 6)}...{userWallets[0].address.slice(-4)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Member Since */}
                                    <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                                        <Calendar className="w-4 h-4" />
                                        <span>Member since {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <Button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="w-full bg-accent-blue hover:bg-accent-blue/80"
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                                    </Button>

                                    <Button
                                        onClick={handleLogout}
                                        variant="outline"
                                        className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Edit Form and Buy Credits */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Edit Form */}
                        <Card className="bg-card-bg border-card-border">
                            <CardHeader>
                                <CardTitle className="text-white">Profile Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName" className="text-white">First Name</Label>
                                        <Input
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            disabled={!isEditing}
                                            className="bg-gray-800 border-gray-600 text-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lastName" className="text-white">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            disabled={!isEditing}
                                            className="bg-gray-800 border-gray-600 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-white">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        disabled={!isEditing}
                                        className="bg-gray-800 border-gray-600 text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="profileImage" className="text-white">Profile Image URL</Label>
                                    <Input
                                        id="profileImage"
                                        value={formData.profileImageUrl}
                                        onChange={(e) => handleInputChange('profileImageUrl', e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="https://example.com/image.jpg"
                                        className="bg-gray-800 border-gray-600 text-white"
                                    />
                                </div>

                                {/* Edit Mode Actions */}
                                {isEditing && (
                                    <div className="flex space-x-3 pt-4">
                                        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                                            Save Changes
                                        </Button>
                                        <Button onClick={handleCancel} variant="outline">
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Buy Credits */}
                        <Card className="bg-card-bg border-card-border">
                            <CardHeader>
                                <CardTitle className="text-white">Buy Credits</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-400 mb-4">Purchase platform credits using fiat currency - No wallet required!</p>

                                {/* Credit Packages - Available to everyone */}
                                <div className="space-y-4">
                                    {/* Credit Packages */}
                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            { credits: 50, price: '$5', popular: true, usdc: '5' }
                                        ].map((pkg) => (
                                            <div key={pkg.credits} className={`relative bg-gray-800 p-4 rounded-lg border ${pkg.popular ? 'border-blue-500 bg-blue-900/10' : 'border-gray-600'}`}>
                                                {pkg.popular && (
                                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                        <Badge className="bg-blue-500 text-white text-xs">
                                                            Best Value
                                                        </Badge>
                                                    </div>
                                                )}
                                                <div className="text-center">
                                                    <div className="flex items-center justify-center space-x-3 mb-3">
                                                        <div className="text-center">
                                                            <div className="text-2xl font-bold text-white">{pkg.credits}</div>
                                                            <div className="text-sm text-slate-400">Credits</div>
                                                        </div>
                                                        <div className="text-slate-500 text-2xl font-light">=</div>
                                                        <div className="text-center">
                                                            <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{pkg.price}</div>
                                                            <div className="text-sm text-slate-400">{pkg.usdc} USDC</div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Payment Method Selection */}
                                                    <div className="flex space-x-4 mb-3">
                                                        {/* Apple Pay Option */}
                                                        <button
                                                        onClick={async () => {
                                                            try {
                                                                    // First get a session token
                                                                    const sessionResponse = await fetch('/api/cdp/session-token', {
                                                                    method: 'POST',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({
                                                                            walletAddress: '',
                                                                            asset: 'USDC'
                                                                    })
                                                                });

                                                                    if (!sessionResponse.ok) {
                                                                        const errorData = await sessionResponse.json().catch(() => ({}));
                                                                        throw new Error(errorData.error_description || 'Failed to get session token');
                                                                    }

                                                                    const sessionData = await sessionResponse.json();
                                                                    const sessionToken = sessionData.sessionToken;

                                                                    if (!sessionToken) {
                                                                        throw new Error('No session token received');
                                                                    }

                                                                    // Now open the Coinbase onramp with the session token
                                                                    const onrampUrl = `https://pay.coinbase.com/buy/select-asset?sessionToken=${sessionToken}&defaultPaymentMethod=APPLE_PAY&skipPaymentMethodSelection=true&applePayEnabled=true&cardEnabled=true&paymentMethodPriority=APPLE_PAY`;
                                                                    
                                                                    const width = 600;
                                                                    const height = 700;
                                                                    const left = (window.screen.width - width) / 2;
                                                                    const top = (window.screen.height - height) / 2;
                                                                    const popupFeatures = `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,status=yes`;
                                                                    
                                                                    window.open(onrampUrl, '_blank', popupFeatures);
                                                                } catch (error: any) {
                                                                    console.error('Error in onramp handler:', error);
                                                                    alert('Unable to open onramp. Please try again later.');
                                                                }
                                                            }}
                                                            className="flex-1 bg-black hover:bg-gray-900 text-white px-2 py-3 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                                                        >
                                                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                                                            </svg>
                                                            <span className="font-semibold text-sm">Apple Pay</span>
                                                        </button>

                                                        {/* Credit Card Option */}
                                                        <button
                                                            onClick={async () => {
                                                                try {
                                                                    // First get a session token
                                                                    const sessionResponse = await fetch('/api/cdp/session-token', {
                                                                        method: 'POST',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({
                                                                            walletAddress: '',
                                                                            asset: 'USDC'
                                                                        })
                                                                    });

                                                                    if (!sessionResponse.ok) {
                                                                        const errorData = await sessionResponse.json().catch(() => ({}));
                                                                        throw new Error(errorData.error_description || 'Failed to get session token');
                                                                    }

                                                                    const sessionData = await sessionResponse.json();
                                                                    const sessionToken = sessionData.sessionToken;

                                                                    if (!sessionToken) {
                                                                        throw new Error('No session token received');
                                                                    }

                                                                    // Now open the Coinbase onramp with the session token
                                                                    const onrampUrl = `https://pay.coinbase.com/buy/select-asset?sessionToken=${sessionToken}&defaultPaymentMethod=CREDIT_CARD&skipPaymentMethodSelection=true&applePayEnabled=true&cardEnabled=true&paymentMethodPriority=CREDIT_CARD`;
                                                                    
                                                                    const width = 600;
                                                                    const height = 700;
                                                                    const left = (window.screen.width - width) / 2;
                                                                    const top = (window.screen.height - height) / 2;
                                                                    const popupFeatures = `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,status=yes`;
                                                                    
                                                                    window.open(onrampUrl, '_blank', popupFeatures);
                                                            } catch (error: any) {
                                                                console.error('Error in onramp handler:', error);
                                                                alert('Unable to open onramp. Please try again later.');
                                                            }
                                                        }}
                                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-3 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-2"
                                                        >
                                                            <CreditCard className="w-6 h-6" />
                                                            <span className="font-semibold text-sm">Credit Card</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Payment Info */}
                                    <div className="mt-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-medium text-slate-300 tracking-wide">PAYMENT DETAILS</h3>
                                        </div>
                                        
                                        <div className="bg-slate-800/30 rounded-xl p-4 backdrop-blur-sm border border-slate-700/50">
                                            <div className="grid grid-cols-2 gap-6 text-sm">
                                                <div className="space-y-3">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <div className="text-slate-200 font-medium">Instant Credit</div>
                                                            <div className="text-slate-400 text-xs">Credits added immediately</div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <div className="text-slate-200 font-medium">No Wallet</div>
                                                            <div className="text-slate-400 text-xs">Guest checkout supported</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-3">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                                                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <div className="text-slate-200 font-medium">All Cards</div>
                                                            <div className="text-slate-400 text-xs">Visa, Mastercard, Amex</div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                                            <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <div className="text-slate-200 font-medium">Bank Transfer</div>
                                                            <div className="text-slate-400 text-xs">ACH transfers (US)</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 pt-4 border-t border-slate-700/50">
                                                <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
                                                    <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                                                    <span>256-bit SSL</span>
                                                    <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                                                    <span>PCI Compliant</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Payment Method Selection Modal */}
            <PaymentMethodModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSelect={async (method) => {
                    setShowPaymentModal(false);

                    try {
                        const walletAddress = '';

                        const response = await fetch('/api/cdp/onramp', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                amount: 5, // $5 for credits
                                currency: 'USD',
                                asset: 'USDC',
                                walletAddress: walletAddress,
                                country: 'US',
                                subdivision: 'CA',
                                preferredPaymentMethod: method
                            })
                        });

                        if (!response.ok) {
                            const errorData = await response.json().catch(() => ({}));
                            throw new Error(errorData.error_description || 'Failed to process onramp');
                        }

                        const onrampData = await response.json();

                        if (onrampData.onrampUrl) {
                            const newWindow = window.open(onrampData.onrampUrl, '_blank', 'width=600,height=700');
                            if (newWindow) {
                                setShowPaymentModal(false);
                            } else {
                                throw new Error('Failed to open onramp window');
                            }
                        } else {
                            const fallbackUrl = `https://pay.coinbase.com/buy/select-asset?defaultPaymentMethod=APPLE_PAY&skipPaymentMethodSelection=true&applePayEnabled=true&cardEnabled=true`;
                            window.open(fallbackUrl, '_blank', 'width=600,height=700');
                            setShowPaymentModal(false);
                        }
                    } catch (error: any) {
                        console.error('Error in onramp handler:', error);
                        alert('Unable to open onramp. Please try again later.');
                    }
                }}
                amount={5} // $5 for credits
            />
        </div>
    );
}

// Main Account Page Component
export default function Account() {
    return <UserProfile />;
}
