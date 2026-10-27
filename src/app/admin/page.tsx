import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "Administration" };

export default function AdminPage() {
  return (
    <PageContainer>
      <EmptyState
        title="Admin console is scheduled for Phase Four"
        description="Moderation, verification, and audit logs will use privileged roles that ordinary users cannot self-assign."
      />
    </PageContainer>
  );
}
