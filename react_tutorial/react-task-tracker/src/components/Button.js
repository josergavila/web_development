import PropTypes from 'prop-types'

const Button = ({ color, text }) => {
    return (
        <div>
            <button className='btn' style={{background: color}}>{text}</button>            
        </div>
    )
}

Button.defaultProps = {
    color: 'steelblue',
}


Button.PropTypes = {
    color: PropTypes.string,
    text: PropTypes.string,
}


export default Button
