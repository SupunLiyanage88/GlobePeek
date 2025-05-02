import React from 'react';
import PropTypes from 'prop-types';

const NavButton = ({ onClick, children, className = '', type = 'button' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-4 py-2 text-text bg-background rounded-md hover:bg-surface transition-colors duration-300 ${className}`}
        >
            {children}
        </button>
    );
};

NavButton.propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    type: PropTypes.string,
};

export default NavButton;
