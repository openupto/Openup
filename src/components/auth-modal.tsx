import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Separator } from './ui/separator';
import { useAuth } from './auth-context';
import { toast } from 'sonner@2.0.3';
import { Link2, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
}

export function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await signUp(formData.email, formData.password, formData.name);
        if (error) {
          toast.error(error.message || 'Failed to create account');
        } else {
          toast.success('Account created successfully! Welcome to OpenUp!');
          onClose();
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast.error(error.message || 'Failed to sign in');
        } else {
          toast.success('Welcome back!');
          onClose();
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', name: '' });
    setShowPassword(false);
  };

  const switchMode = () => {
    onModeChange(mode === 'signin' ? 'signup' : 'signin');
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#006EF7] to-blue-600 rounded-lg flex items-center justify-center">
              <Link2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-600">
            {mode === 'signin' 
              ? 'Sign in to access your OpenUp dashboard and manage your links.' 
              : 'Join OpenUp to create your personalized link page and connect with your audience.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'signin' ? 'Enter your password' : 'Create a password'}
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 h-4 w-4 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#006EF7] to-blue-600 hover:from-blue-600 hover:to-[#006EF7]"
              disabled={loading}
            >
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-slate-600">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
            </span>{' '}
            <button
              type="button"
              className="text-[#006EF7] hover:text-blue-600 font-medium"
              onClick={switchMode}
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </div>

          {mode === 'signup' && (
            <p className="text-xs text-slate-500 text-center">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-[#006EF7] hover:text-blue-600">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-[#006EF7] hover:text-blue-600">
                Privacy Policy
              </a>
              .
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}