

export const asyncHandler = (fn) =>{
    return async (req, res, next) => {
    try {
        await fn(req, res, next)

    }catch(e) {
        console.log(e)
        res.status(e.code || 500).json({
            success: false,
            message: e.message
        })

    }
}

}