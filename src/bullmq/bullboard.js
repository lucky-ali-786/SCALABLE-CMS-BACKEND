import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter }  from '@bull-board/api/bullMQAdapter';
import  { ExpressAdapter }  from '@bull-board/express';
import { emailqueue } from './producer.js';
import { postqueue } from './producer.js';
export const setBullBoard=(app)=>{
const serverAdapter=new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
createBullBoard({
    queues:[
        new BullMQAdapter(emailqueue),
        new BullMQAdapter(postqueue)
    ]
    ,
    serverAdapter:serverAdapter
})
app.use('/admin/queues',serverAdapter.getRouter());
}