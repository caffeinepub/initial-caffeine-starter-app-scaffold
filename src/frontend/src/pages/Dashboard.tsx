import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCallerUserProfile } from "../hooks/useQueries";

export default function Dashboard() {
  const { data: userProfile, isLoading: profileLoading } =
    useGetCallerUserProfile();

  if (profileLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight font-devanagari">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg font-body">
            Welcome back{userProfile ? `, ${userProfile.name}` : ""}! 🙏
          </p>
        </div>
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-devanagari">🙏 Jai Shri Ram</CardTitle>
            <CardDescription className="font-body">
              Your spiritual journey continues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground font-body">
              Use the bottom navigation to explore Panchang, Jap Counter, Mandir
              Finder, and more.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
