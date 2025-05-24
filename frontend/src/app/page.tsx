import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Transform Customer Feedback into Actionable Insights
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Upload your customer list, ask questions, and get AI-powered voice feedback analysis in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/login" 
                className="px-8 py-4 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-all transform hover:scale-105"
              >
                Get Started
              </Link>
              <Link 
                href="/login?mode=signup" 
                className="px-8 py-4 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition-all transform hover:scale-105"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy Upload",
                description: "Simply upload your customer list in CSV format and we'll handle the rest.",
                icon: "📊"
              },
              {
                title: "Smart Questions",
                description: "Create custom questions that get meaningful responses from your customers.",
                icon: "💡"
              },
              {
                title: "Instant Analysis",
                description: "Get AI-powered insights and analytics from your customer feedback.",
                icon: "📈"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Customer Feedback?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of businesses already using our platform.
          </p>
          <Link 
            href="/login?mode=signup" 
            className="inline-block px-8 py-4 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-all transform hover:scale-105"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  )
} 