import { useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Button, EmptyState } from '../components/ui'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <>
      <PageHeader title="404" subtitle="This page does not exist." />
      <EmptyState
        icon={Compass}
        title="Lost in the office"
        description="The page you are looking for was moved, renamed, or never existed."
        action={
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to dashboard
          </Button>
        }
      />
    </>
  )
}
