import { useState } from 'react';
import { Film } from 'lucide-react';

const getInitial = (value) => value?.trim().charAt(0).toUpperCase() || '?';

export const AdminMovieCell = ({ image, title, subtitle }) => {
  const [failedSrc, setFailedSrc] = useState(null);
  const showImage = image && failedSrc !== image;

  return (
    <div className="admin-entity-cell admin-entity-cell--movie">
      <div className="admin-entity-poster">
        {showImage ? (
          <img
            src={image}
            alt={`Poster ${title}`}
            onError={() => setFailedSrc(image)}
          />
        ) : null}
        {!showImage && <span aria-hidden="true"><Film size={17} strokeWidth={1.7} /></span>}
      </div>
      <span className="admin-entity-copy">
        <strong title={title}>{title || 'Chưa có tên phim'}</strong>
        <small title={subtitle}>{subtitle || 'Chưa cập nhật thông tin'}</small>
      </span>
    </div>
  );
};

export const AdminPersonCell = ({ name, email }) => (
  <div className="admin-entity-cell admin-entity-cell--person">
    <span className="admin-entity-avatar" aria-hidden="true">{getInitial(name)}</span>
    <span className="admin-entity-copy">
      <strong title={name}>{name || 'Chưa cập nhật tên'}</strong>
      <small title={email}>{email || 'Chưa cập nhật email'}</small>
    </span>
  </div>
);
