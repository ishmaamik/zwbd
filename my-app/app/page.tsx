// @ts-nocheck
'use client'
import { useState, useEffect } from 'react'
import { ArrowRight, Leaf, Recycle, Users, Coins, MapPin, ChevronRight,Trash, Heart,HandHeart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Poppins } from 'next/font/google'
import Link from 'next/link'
import ContractInteraction from '@/components/ContractInteraction'
import { getRecentReports, getAllRewards, getWasteCollectionTasks } from '@/utils/db/actions'
const poppins = Poppins({ 
  weight: ['300', '400', '600'],
  subsets: ['latin'],
  display: 'swap',
})

function AnimatedDustbin() {
  return (
    <div className="relative w-40 h-40 mx-auto mb-8">
     
      {/* GIF */}
      <img 
        src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjRjNTlyMHlqeWJqMzVweHI2bjBza3Nybmpoa2xuc3BxYTVkanp4OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Dh8ULOqmVxHGoGSrku/giphy.gif" 
        alt="Animated Dustbin GIF" 
        className="relative w-full h-full object-contain rounded-full shadow-lg"
      />

      
    </div>
  );
}


export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [impactData, setImpactData] = useState({
    wasteCollected: 0,
    reportsSubmitted: 0,
    tokensEarned: 0,
    co2Offset: 0
  });

  

  useEffect(() => {
    async function fetchImpactData() {
      try {
        const reports = await getRecentReports(100);  // Fetch last 100 reports
        const rewards = await getAllRewards();
        const tasks = await getWasteCollectionTasks(100);  // Fetch last 100 tasks

        const wasteCollected = tasks.reduce((total, task) => {
          const match = task.amount.match(/(\d+(\.\d+)?)/);
          const amount = match ? parseFloat(match[0]) : 0;
          return total + amount;
        }, 0);

        const reportsSubmitted = reports.length;
        const tokensEarned = rewards.reduce((total, reward) => total + (reward.points || 0), 0);
        const co2Offset = wasteCollected * 0.5;  // Assuming 0.5 kg CO2 offset per kg of waste

        setImpactData({
          wasteCollected: Math.round(wasteCollected * 10) / 10, // Round to 1 decimal place
          reportsSubmitted,
          tokensEarned,
          co2Offset: Math.round(co2Offset * 10) / 10 // Round to 1 decimal place
        });
      } catch (error) {
        console.error("Error fetching impact data:", error);
        // Set default values in case of error
        setImpactData({
          wasteCollected: 0,
          reportsSubmitted: 0,
          tokensEarned: 0,
          co2Offset: 0
        });
      }
    }

    fetchImpactData();
  }, []);

  const login = () => {
    setLoggedIn(true);
  };

  return (
    <div className={`container mx-auto px-4 py-16 ${poppins.className}`}>
      <section className="text-center mb-20">
        <AnimatedDustbin />
        <h1 className="text-6xl font-bold mb-6 text-gray-800 tracking-tight">
         <span className="text-red-600">Zero Waste</span> <span className="text-[#006A4E]">Bangladesh</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
        Join our mission of zero waste by actively reporting and collecting waste, creating a cleaner, greener future for all !
        </p>
        {!loggedIn ? (
          <Button
          onClick={login}
          className="bg-[#006A4E] hover:bg-[#005a3e] text-white text-lg py-6 px-6 rounded-none font-medium transition-all duration-300 ease-in-out transform hover:scale-105">
          Make a Difference !
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        ) : (
          <Link href="/report">
            <Button className="bg-green-600 hover:bg-green-700 text-white text-lg py-6 px-10 rounded-full font-medium transition-all duration-300 ease-in-out transform hover:scale-105">
              Report Waste
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        )}
      </section>
          
      <section className="grid md:grid-cols-3 gap-10 mb-20">
      <FeatureCard
        icon={() => (
          <img 
            src="https://i.pinimg.com/736x/b5/1e/8f/b51e8fbd5e746ce402d3240f6704df38.jpg" 
            alt="Bangladesh Flag" 
            className="h-8 w-14 object-cover" 
          />
        )}
        title="Make a clean Bangladesh!"
        description="Join the mission to make Bangladesh a cleaner, greener place."
      />
      
      <FeatureCard
        icon={HandHeart}
        title="Gain rewards"
        description="Gain our love for taking action in waste management."
      />
      
      <FeatureCard
        icon={Recycle}
        title="Zero Waste"
        description="Work towards a zero-waste future by reporting and collecting waste."
      />
    </section>


      
      <section className="bg-white p-10 rounded-3xl shadow-lg mb-20">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Our Impact</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <ImpactCard title="Waste Collected" value={`${impactData.wasteCollected} kg`} icon={Recycle} />
          <ImpactCard title="Reports Submitted" value={impactData.reportsSubmitted.toString()} icon={MapPin} />
          <ImpactCard title="Tokens Earned" value={impactData.tokensEarned.toString()} icon={Coins} />
          <ImpactCard title="CO2 Offset" value={`${impactData.co2Offset} kg`} icon={Leaf} />
        </div>
      </section>

   
    </div>
  )
}

function ImpactCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) {
  const formattedValue = typeof value === 'number' ? value.toLocaleString('en-US', { maximumFractionDigits: 1 }) : value;
  
  return (
    <div className="p-6 rounded-xl bg-gray-50 border border-gray-100 transition-all duration-300 ease-in-out hover:shadow-md">
      <Icon className="h-10 w-10 text-green-500 mb-4" />
      <p className="text-3xl font-bold mb-2 text-gray-800">{formattedValue}</p>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col items-center text-center">
      <div className="bg-green-100 p-4 rounded-full mb-6">
        <Icon className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}