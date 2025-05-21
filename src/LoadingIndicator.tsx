import PropTypes from "prop-types";
import "./LoadingIndicator.css";

const LoadingIndicator = ({className}: { className?: string }) => {
    return (
        <>
            <LoadingSpinner className={className ?? ''} color="#E22A86" size={'32px'}/>
        </>
    );
}

export default LoadingIndicator;

const LoadingSpinner = ({ size, color, className }: { size?: string; color?: string; className?: string }) => {
    const spinnerStyle = {
        borderTop: `4px solid ${color}`,
        borderLeft: `4px solid ${color}`,
        borderBottom: `4px solid ${color}`,
        borderRight: '4px solid transparent',
        width: size,
        height: size,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    };

    return <div className={className} style={spinnerStyle}></div>;
};

LoadingSpinner.propTypes = {
    size: PropTypes.string,
    color: PropTypes.string,
    className: PropTypes.string,
};

LoadingSpinner.defaultProps = {
    size: '30px',
    color: '#053552',
};