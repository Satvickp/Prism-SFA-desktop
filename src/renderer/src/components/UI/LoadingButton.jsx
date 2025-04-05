import Spinner from 'react-bootstrap/Spinner';

export default function LoadingButton(props) {
    const { isLoading, className, children, ...rest } = props;

    return (
        <button
            className={`btn ${className}`}
            {...rest}
            disabled={isLoading}
        >
            {isLoading ? <Spinner animation="border" role="status" size="sm" /> : children}
            
        </button>
    );
}
