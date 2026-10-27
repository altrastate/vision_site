import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "Employer dashboard" };

export default function EmployerDashboardPage() {
  return (
    <PageContainer>
      <EmptyState
        title="Employer workspace is scheduled for Phase Three"
        description="Vacancy management and applicant review will use company membership roles already defined in the database."
      />
    </PageContainer>
  );
}
