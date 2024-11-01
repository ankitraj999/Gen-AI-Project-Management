import TabbedLayout from '../components/tabbed-layout'
import Head from 'next/head';
import Image from 'next/image'

import { FaProjectDiagram, FaClipboardCheck, FaChartLine } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <Head>
    <title>ClearMind AI Project Management Dashboard</title>
    <meta name="description" content="SRS Document Upload and User Story Analysis" />
    <link rel="icon" href="/favicon.ico" />
    </Head>
      
    <main className="container mx-auto p-4">
   
    <header className="text-center py-12">
      <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg">
      ClearMind AI Project Management Dashboard
        {/*ClearMind AI <span className="block h-1 w-40 mx-auto mt-4 bg-gradient-to-r from-blue-500 to-indigo-600"></span> */}
      </h1>
      <p className="text-xl text-gray-600 mt-6 max-w-2xl mx-auto">
        Improve Your Requirements Engineering Experience with Gen-AI
      </p>
    </header>
 

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <FeatureCard 
            icon={<FaProjectDiagram className="text-4xl text-indigo-500" />}
            title="SRS Analysis"
            description="Upload and analyze Software Requirement Specifications with ease."
          />
          <FeatureCard 
            icon={<FaClipboardCheck className="text-4xl text-indigo-500" />}
            title="User Story Management"
            description="Create, track, and refine user stories for agile development."
          />
          <FeatureCard 
            icon={<FaChartLine className="text-4xl text-indigo-500" />}
            title="Project Insights"
            description="Gain valuable insights with our advanced analytics tools."
          />
        </div> */}

        <TabbedLayout />
      </main> 

      <footer className="text-center py-4 text-gray-600">
        © 2024 Project Management Dashboard. All rights reserved.
      </footer>
    </div>
  )
}

{/* function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-center mb-4">
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-indigo-700 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  )
} */}