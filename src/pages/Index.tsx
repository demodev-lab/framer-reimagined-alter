
import React from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Play, Star, Users, Zap, Shield, Target } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-purple-700">New AI Features Available</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Build Better
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                AI Products
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Create powerful AI-driven applications with our comprehensive suite of tools and APIs. 
              From machine learning to natural language processing.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" className="border-2 border-gray-300 hover:border-gray-400 px-8 py-4 rounded-full text-lg font-semibold bg-white hover:bg-gray-50 transition-all duration-300">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-900">10M+</div>
                <div className="text-gray-600">API Calls</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">50K+</div>
                <div className="text-gray-600">Developers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
            </div>
          </div>

          {/* Background Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 mb-6">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Powerful Features</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Everything you need to
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  build amazing AI apps
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our platform provides all the tools and infrastructure you need to create, deploy, and scale AI applications.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Process millions of requests with sub-second latency. Our optimized infrastructure ensures your AI models perform at peak efficiency.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise Security</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Bank-level security with end-to-end encryption, compliance certifications, and advanced threat protection for your AI workloads.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Precision Models</h3>
                  <p className="text-gray-600 leading-relaxed">
                    State-of-the-art AI models fine-tuned for accuracy. Achieve better results with our advanced machine learning algorithms.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to transform your
                <br />
                business with AI?
              </h2>
              <p className="text-xl text-purple-100 mb-12 max-w-2xl mx-auto">
                Join thousands of developers and companies who trust our platform to power their AI applications.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Building Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300">
                  <Users className="mr-2 w-5 h-5" />
                  Talk to Sales
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-6 md:mb-0">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg fill="white" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="m12 1.25-10.75 6.25v12.5l10.75 6.25 10.75-6.25v-12.5z" fill="white" stroke="white" strokeLinejoin="round" strokeWidth="1.5" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">탐구 연구소</span>
              </div>
              
              <div className="flex items-center gap-6 text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2024 탐구 연구소. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
