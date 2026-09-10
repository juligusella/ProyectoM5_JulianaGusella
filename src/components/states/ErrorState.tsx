interface ErrorStateProps {
  message: string
}

const ErrorState = ({ message }: ErrorStateProps) => {
  return <p>{message}</p>
}

export default ErrorState