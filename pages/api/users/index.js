import {query as q} from 'faunadb'
import {serverClient} from '../../../utils/fauna-auth'

export default async (req, res) => {

    const {limit, cursor} = req.query
    console.log(limit, cursor)
    try {
        const users = await serverClient.query(
            q.Map(
                q.Paginate(
                    q.Match(
                        q.Index('all_users')
                    ), {size: parseInt(limit)}
                ),
                (ref) => q.Get(ref)
            )
        )
        
        // res.status(200).send({data: users.data, after: users.after})
        res.status(200).send(users)
    } catch (e) {
        res.status(500).send({error: e.message})
    }
}