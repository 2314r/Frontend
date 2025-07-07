import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Crown, Check, Star, Zap, Shield, Headphones, BarChart3, Bell } from 'lucide-react';

export const ProPage: React.FC = () => {
  const { user, setUser } = useAppContext();

  const handleUpgrade = () => {
    if (user) {
      setUser({ ...user, isPro: true });
    }
  };

  const features = [
    {
      icon: BarChart3,
      title: 'Advanced Charts & Indicators',
      description: 'Access professional-grade charting tools with 50+ technical indicators',
      free: false,
      pro: true,
    },
    {
      icon: Bell,
      title: 'Real-time Price Alerts',
      description: 'Get instant notifications when stocks hit your target prices',
      free: false,
      pro: true,
    },
    {
      icon: Zap,
      title: 'Lightning-fast Data',
      description: 'Real-time market data with zero delays and premium data feeds',
      free: false,
      pro: true,
    },
    {
      icon: Shield,
      title: 'Portfolio Analytics',
      description: 'Advanced portfolio analysis, risk metrics, and performance tracking',
      free: 'Basic',
      pro: 'Advanced',
    },
    {
      icon: Headphones,
      title: 'Priority Support',
      description: '24/7 priority customer support with dedicated account manager',
      free: false,
      pro: true,
    },
    {
      icon: Star,
      title: 'Exclusive Market Insights',
      description: 'Weekly market analysis reports and investment recommendations',
      free: false,
      pro: true,
    },
  ];

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started with stock tracking',
      features: [
        'Basic stock prices',
        'Simple portfolio tracking',
        'Market news',
        'Basic charts',
        'Email support',
      ],
      buttonText: 'Current Plan',
      buttonStyle: 'bg-gray-100 text-gray-600 cursor-not-allowed',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      description: 'Everything you need for professional trading and investing',
      features: [
        'Real-time market data',
        'Advanced charts & indicators',
        'Price alerts & notifications',
        'Portfolio analytics',
        'Priority support',
        'Market insights & reports',
        'Multiple watchlists',
        'Export capabilities',
      ],
      buttonText: user?.isPro ? 'Current Plan' : 'Upgrade to Pro',
      buttonStyle: user?.isPro 
        ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
        : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white',
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Crown className="h-16 w-16 text-yellow-500" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">StockFlow Pro</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Unlock professional-grade tools, real-time data, and advanced analytics to take your investing to the next level.
            </p>
            {user?.isPro ? (
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold">
                <Crown className="h-5 w-5" />
                <span>You're already a Pro member!</span>
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Start Your Pro Journey
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Features Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            See What You Get with Pro
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                    <feature.icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-500">Free:</span>
                        {feature.free ? (
                          typeof feature.free === 'string' ? (
                            <span className="text-sm text-gray-600">{feature.free}</span>
                          ) : (
                            <Check className="h-4 w-4 text-success-500" />
                          )
                        ) : (
                          <span className="text-sm text-gray-400">Not included</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-orange-600">Pro:</span>
                        {feature.pro ? (
                          typeof feature.pro === 'string' ? (
                            <span className="text-sm font-semibold text-orange-600">{feature.pro}</span>
                          ) : (
                            <Check className="h-4 w-4 text-orange-500" />
                          )
                        ) : (
                          <span className="text-sm text-gray-400">Not included</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Choose Your Plan
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={plan.name}
                className={`relative bg-white rounded-2xl border-2 p-8 shadow-sm ${
                  plan.popular 
                    ? 'border-orange-300 shadow-orange-100' 
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-success-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={plan.name === 'Pro' && !user?.isPro ? handleUpgrade : undefined}
                  disabled={plan.name === 'Free' || user?.isPro}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What Our Pro Users Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Day Trader',
                content: 'The real-time alerts have completely changed my trading game. I never miss an opportunity now.',
                rating: 5,
              },
              {
                name: 'Michael Chen',
                role: 'Portfolio Manager',
                content: 'The advanced analytics help me make better investment decisions for my clients. Worth every penny.',
                rating: 5,
              },
              {
                name: 'Emily Rodriguez',
                role: 'Individual Investor',
                content: 'Finally, a platform that gives me professional-grade tools at an affordable price.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={testimonial.name} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};