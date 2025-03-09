
import { Technician } from "@/types/technician";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, TrendingUp, Package, Award } from "lucide-react";

type TopTechnicianCardsProps = {
  technicians: Technician[];
};

const TopTechnicianCards = ({ technicians }: TopTechnicianCardsProps) => {
  // Sort technicians by various metrics to find top performers
  const bestRatedTechnician = [...technicians].sort((a, b) => b.rating - a.rating)[0];
  const mostJobsTechnician = [...technicians].sort((a, b) => b.completedJobs - a.completedJobs)[0];
  const mostRevenueTechnician = [...technicians].sort((a, b) => b.totalRevenue - a.totalRevenue)[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Best Rated Technician */}
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="h-10 w-10 text-amber-500" />
            <div className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
              Top Rated
            </div>
          </div>
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white mr-3 text-lg font-bold">
              {bestRatedTechnician.initials}
            </div>
            <div>
              <h3 className="font-bold text-lg">{bestRatedTechnician.name}</h3>
              <p className="text-amber-700">{bestRatedTechnician.specialty}</p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex items-center gap-1 bg-amber-200 text-amber-800 px-3 py-1 rounded-full">
              <Award className="h-4 w-4" />
              <span className="font-medium">{bestRatedTechnician.rating}/5 Rating</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Most Jobs Completed */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <Package className="h-10 w-10 text-blue-500" />
            <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
              Most Jobs
            </div>
          </div>
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3 text-lg font-bold">
              {mostJobsTechnician.initials}
            </div>
            <div>
              <h3 className="font-bold text-lg">{mostJobsTechnician.name}</h3>
              <p className="text-blue-700">{mostJobsTechnician.specialty}</p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex items-center gap-1 bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">{mostJobsTechnician.completedJobs} Jobs</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Most Revenue Generated */}
      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <Award className="h-10 w-10 text-emerald-500" />
            <div className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium">
              Top Sales
            </div>
          </div>
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white mr-3 text-lg font-bold">
              {mostRevenueTechnician.initials}
            </div>
            <div>
              <h3 className="font-bold text-lg">{mostRevenueTechnician.name}</h3>
              <p className="text-emerald-700">{mostRevenueTechnician.specialty}</p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex items-center gap-1 bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">${mostRevenueTechnician.totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopTechnicianCards;
