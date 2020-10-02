export function catchAsync(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(err => next(err));
    }
}

export function catchErrors(err, req, res, next) {
    console.log('err', err)
    res.status(500).send({error: err.message});
}
