// components/dev-auth.tsx
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

// Get password from environment variable, fallback to hardcoded value for development
const DEV_PASSWORD = import.meta.env.VITE_DEV_PASSWORD || 'delula-dev-2024';

export function DevAuth({ children }: { children: JSX.Element }) {
    const [ok, setOk] = useState<boolean | null>(null);
    const [pw, setPw] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [, setLocation] = useLocation();

    useEffect(() => {
        const auth = sessionStorage.getItem('dev-auth');
        if (auth === 'yes') setOk(true);
    }, []);

    if (ok === false) {
        setLocation('/');
        return null;
    }

    if (ok === true) return children;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <Card className="w-full max-w-md bg-card-bg border-card-border">
                <CardHeader>
                    <CardTitle className="text-white text-center">🔒 Development Access</CardTitle>
                    <p className="text-gray-400 text-center text-sm">
                        This is a development page. Enter password to continue.
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (pw === DEV_PASSWORD) {
                            sessionStorage.setItem('dev-auth', 'yes');
                            setOk(true);
                        } else {
                            alert('Invalid password');
                            setOk(false);
                        }
                    }}>
                        <div className="space-y-4">
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Dev password"
                                    value={pw}
                                    onChange={(e) => setPw(e.target.value)}
                                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 pr-10"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            <Button type="submit" className="w-full">Enter</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
