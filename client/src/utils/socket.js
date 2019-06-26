import io from 'socket.io-client'
import {
  socketNode
} from '../_config/des'

export default io.connect(socketNode)
