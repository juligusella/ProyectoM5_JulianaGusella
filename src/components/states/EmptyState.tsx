interface EmptyStateProps {
  message: string
}

const EmptyState = ({ message }: EmptyStateProps) => {
  return <p>{message}</p>
}

export default EmptyState