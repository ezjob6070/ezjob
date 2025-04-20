
import { Technician } from "@/types/technician";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, TrendingUp, Package, Award, User } from "lucide-react";
import { getInitials } from "@/lib/utils";

type TopTechnicianCardsProps = {
  technicians: Technician[];
};

const TopTechnicianCards = ({ technicians }: TopTechnicianCardsProps) => {
  // Check if there are any technicians
  if (!technicians || technicians.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <User className="h-10 w-10 text-gray-400" />
                <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                  No Data
                </div>
              </div>
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white mr-3 text-lg font-bold">
                  N/A
                </div>
                <div>
                  <h3 className="font-bold text-lg">No technician data</h3>
                  <p className="text-gray-500">Add technicians to see stats</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Sort technicians by various metrics to find top performers
  const bestRatedTechnician = [...technicians]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
  const mostJobsTechnician = [...technicians]
    .sort((a, b) => (b.completedJobs || 0) - (a.completedJobs || 0))[0];
  const mostRevenueTechnician = [...technicians]
    .sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))[0];

  // Ensure initials are available for each technician
  const ensureInitials = (tech: Technician) => {
    if (!tech.initials && tech.name) {
      return getInitials(tech.name);
    }
    return tech.initials || "N/A";
  };

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
              {ensureInitials(bestRatedTechnician)}
            </div>
            <div>
              <h3 className="font-bold text-lg">{bestRatedTechnician.name}</h3>
              <p className="text-amber-700">{bestRatedTechnician.specialty}</p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex items-center gap-1 bg-amber-200 text-amber-800 px-3 py-1 rounded-full">
              <Award className="h-4 w-4" />
              <span className="font-medium">{bestRatedTechnician.rating || 0}/5 Rating</span>
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
              {ensureInitials(mostJobsTechnician)}
            </div>
            <div>
              <h3 className="font-bold text-lg">{mostJobsTechnician.name}</h3>
              <p className="text-blue-700">{mostJobsTechnician.specialty}</p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex items-center gap-1 bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">{mostJobsTechnician.completedJobs || 0} Jobs</span>
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
              {ensureInitials(mostRevenueTechnician)}
            </div>
            <div>
              <h3 className="font-bold text-lg">{mostRevenueTechnician.name}</h3>
              <p className="text-emerald-700">{mostRevenueTechnician.specialty}</p>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="flex items-center gap-1 bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">${(mostRevenueTechnician.totalRevenue || 0).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopTechnicianCards;
