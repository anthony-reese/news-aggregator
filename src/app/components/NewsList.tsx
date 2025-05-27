import ArticleCard from './ArticleCard';
import { Article } from '@/types/Article';

type NewsListProps = {
  articles: Article[];
  searchQuery: string;
};

export default function NewsList({ articles, searchQuery }: NewsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map((article, index) => (
        <ArticleCard
          key={index}
          article={{ ...article, url: article.url || '' }}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
}
