import { Comment } from "@entities/comment/Comment";
import { IComment } from "@entities/comment/model/IComment";
import styles from './commentList.module.scss';

interface CommentListProps {
  comments: IComment[];
  onUpdate?: () => void;
}

export const CommentList = ({ comments, onUpdate }: CommentListProps) => {
  return (
    <ul className={styles.commentList}>
      {comments.map((comment) => (
        <li key={comment.id}>
          <Comment comment={comment} onUpdate={onUpdate} />
        </li>
      ))}
    </ul>
  )
}