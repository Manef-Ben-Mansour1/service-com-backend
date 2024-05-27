import {CommentEntity} from 'src/comment/entities/comment.entity';

export interface ServerToClientsEvents{
    newComment : (payload: Comment)=>void;
}