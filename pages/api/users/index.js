import {query as q} from 'faunadb'
import {serverClient} from '../../../utils/fauna-auth'

export default async (req, res) => {
    try {
        const users = await serverClient.query(
            q.Map(
                q.Paginate(
                    q.Match(
                        q.Index('all_users')
                    )
                ),
                (ref) => q.Get(ref)
            )
        )
        res.status(200).json(users.data)
    } catch (e) {
        res.status(500).json({error: e.message})
    }
}