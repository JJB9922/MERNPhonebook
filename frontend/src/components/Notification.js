import React from 'react'

const SuccessMsg = ({message}) => {
    if (message === null) {
        return null
    }

    return(
        <div className='successNotif'> 
            {message}
        </div>
    )
}

const ErrorMsg = ({message}) => {
    if (message === null) {
        return null
    }

    return(
        <div className='errorNotif'> 
            {message}
        </div>
    )
}


export default {SuccessMsg, ErrorMsg}
