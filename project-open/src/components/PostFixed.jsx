import "../styles/components/Post.sass"
import { Pin } from "lucide-react";
import { useTranslation } from 'react-i18next';
import Post from "./Post";

const PostFixed = ({ post }) => {
  const { t } = useTranslation();
  return (
    <div id="PostFixed" className="w-100">
      <div className="postFixed col-2"><Pin /> {t("Post fixado")}</div>

      <Post key={post._id} post={post} />
    </div>
  );
}

export default PostFixed;
