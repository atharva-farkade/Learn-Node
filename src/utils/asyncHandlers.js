//we are using promises

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).    //here if the promise is resolved then what happes is written and also handlesd the error
        catch((error) =>next(error));      
        }

    }

    export default asyncHandler;





















//const asyncHandler = ()=> {}
//const asyncHandler = (func)=>  () => {}
//const asyncHandler = (func)=> async () => {}

    







    // This is by using the async and await 
// const asyncHandler = (fn) => async(req, res, next) => {
//     try {
//         await fn(req, res, next);
        
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message || "Internal Server Error"
//         });
//     }
// }

