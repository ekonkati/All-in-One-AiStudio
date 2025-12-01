
import React from 'react';
import { CheckCircle2, Crown, Zap, Shield } from 'lucide-react';
import { PricingPlan } from '../../types';

const Subscription: React.FC = () => {
  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Starter',
      price: 0,
      period: 'month',
      features: ['2 Projects', 'Basic AI Consultant', 'Concept Layouts', 'Standard Reporting'],
      isPopular: false
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 4999,
      period: 'month',
      features: ['Unlimited Projects', 'Advanced FEA Solver', 'DSR / Market Rate Analysis', 'Site Management Suite', 'Procurement Module'],
      isPopular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 15000,
      period: 'project',
      features: ['Dedicated Instance', 'Custom API Integrations', 'White-label Reports', 'Priority Support', 'Multi-user Access Control'],
      isPopular: false
    }
  ];

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Upgrade your Engineering Workflow</h2>
        <p className="text-slate-500">Choose a plan that fits your scale. From individual consultants to large construction firms.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.id} className={`bg-white rounded-2xl shadow-xl border overflow-hidden relative transition-transform hover:-translate-y-2 duration-300 ${plan.isPopular ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-slate-200'}`}>
            {plan.isPopular && (
              <div className="bg-blue-500 text-white text-xs font-bold uppercase tracking-widest text-center py-1.5">
                Most Popular
              </div>
            )}
            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                 {plan.id === 'free' && <Zap className="text-slate-400" size={24} />}
                 {plan.id === 'pro' && <Crown className="text-blue-500" size={24} />}
                 {plan.id === 'enterprise' && <Shield className="text-purple-500" size={24} />}
                 <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-slate-800">₹ {plan.price.toLocaleString()}</span>
                <span className="text-slate-500 text-sm">/ {plan.period}</span>
              </div>
              <button className={`w-full py-3 rounded-xl font-semibold mb-8 transition-colors ${
                plan.isPopular ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}>
                {plan.id === 'free' ? 'Current Plan' : 'Upgrade Now'}
              </button>
              <ul className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                    <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 text-center border-t border-slate-200 pt-8">
          <p className="text-slate-400 text-sm">Need a custom quote for a government agency or large enterprise?</p>
          <button className="text-blue-600 font-medium hover:underline mt-2">Contact Sales</button>
      </div>
    </div>
  );
};

export default Subscription;