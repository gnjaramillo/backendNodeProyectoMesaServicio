
const customHeader = (req, res,next) => {
    console.log(req.body)
    next()


}
module.exports = customHeader