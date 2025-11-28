import { Comment } from "@entities/comment/Comment";
import { IComment } from "@entities/comment/model/IComment";
import styles from './commentList.module.scss';

export const CommentList = ({ comments }: { comments: IComment[] }) => {
  return (
    <ul className={styles.commentList}>
      {comments.map((comment) => (
        <li key={comment.id}>
          <Comment comment={comment} />
        </li>
      ))}
    </ul>
  )
}