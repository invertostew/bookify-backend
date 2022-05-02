import { Request, Response, NextFunction } from "express";

const isSuperUser = (req: Request, res: Response, next: NextFunction) => {
  // ...
};

export default isSuperUser;




// const update = async (req: Request, res: Response) => {
//     const user: User = {
//         id: parseInt(req.params.id),
//         username: req.body.username,
//         password: req.body.password,
//     }
//     try {
//         const authorizationHeader = req.headers.authorization
//         const token = authorizationHeader.split(' ')[1]
//         const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
//         if(decoded.id !== user.id) {
//             throw new Error('User id does not match!')
//         }
//     } catch(err) {
//         res.status(401)
//         res.json(err)
//         return
//     }

//     try {
//         const updated = await store.create(user)
//         res.json(updated)
//     } catch(err) {
//         res.status(400)
//         res.json(err + user)
//     }
// }