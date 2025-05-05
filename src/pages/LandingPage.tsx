import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Users, GitFork, Save, Share2 } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GitFork className="h-6 w-6 text-accent-600" />
            <span className="text-xl font-semibold text-primary-900">FamilyTree</span>
          </div>
          
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-br from-primary-100 to-primary-200">
        <div className="container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-900 leading-tight mb-4">
              Discover and Preserve Your Family History
            </h1>
            <p className="text-lg text-primary-700 mb-8">
              Create beautiful family trees, connect with relatives, and explore your ancestry with our intuitive tool.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to={isAuthenticated ? "/dashboard" : "/register"} className="btn btn-primary text-center px-8 py-3">
                Get Started
              </Link>
              <a href="#features" className="btn btn-secondary text-center px-8 py-3">
                Learn More
              </a>
            </div>
          </div>
          
          <div className="md:w-1/2 mt-12 md:mt-0 animate-fade-in">
            <div className="bg-white p-4 rounded-lg shadow-xl transform rotate-1">
              <img 
                src="https://images.pexels.com/photos/4816313/pexels-photo-4816313.jpeg" 
                alt="Family Tree Example" 
                className="rounded-lg shadow-inner w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card transition-all duration-300 hover:shadow-lg">
              <div className="rounded-full bg-accent-100 p-3 inline-block mb-4">
                <Users className="h-6 w-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Family Tree</h3>
              <p className="text-primary-600">
                Visualize your entire family history with our interactive tree view. Add relatives, define relationships, and see your ancestry come to life.
              </p>
            </div>
            
            <div className="card transition-all duration-300 hover:shadow-lg">
              <div className="rounded-full bg-accent-100 p-3 inline-block mb-4">
                <Save className="h-6 w-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Save & Load Trees</h3>
              <p className="text-primary-600">
                Save your progress and continue building your family tree anytime. Create multiple trees for different branches of your family.
              </p>
            </div>
            
            <div className="card transition-all duration-300 hover:shadow-lg">
              <div className="rounded-full bg-accent-100 p-3 inline-block mb-4">
                <Share2 className="h-6 w-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Profiles</h3>
              <p className="text-primary-600">
                Add rich biographical information to each family member including photos, important dates, and personal stories.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-primary-900 text-primary-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <GitFork className="h-5 w-5 text-accent-500" />
              <span className="text-lg font-semibold">FamilyTree</span>
            </div>
            
            <div className="text-sm">
              &copy; {new Date().getFullYear()} FamilyTree App. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;