import * as yup from 'yup'
import { ResolverMap } from '../../types/graphql-utils'
import { Balance } from '../../entity/Balance'
import { formatYupError } from '../../utils/formatYupError'
import { nameNotLongEnough, amountShouldBePositive } from './errorMessages'

const schema = yup.object().shape({
  name: yup.string().min(3, nameNotLongEnough).max(255),
  amount: yup.number().positive(amountShouldBePositive)
})

export const resolvers: ResolverMap = {
  Query: {
    bye: () => 'bye'
  },
  Mutation: {
    register: async (
      _,
      args: GQL.IRegisterOnMutationArguments
    ) => {
      try {
        await schema.validate(args, { abortEarly: false })
      } catch (err) {
        return formatYupError(err)
      }
      const { name, amount } = args

      const balance = Balance.create({
        name,
        amount
      })
      await balance.save()
      return null
    }
  }
}
