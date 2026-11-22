import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import './App.css'

type AvatarId = 'violet' | 'mint' | 'peach'
type StickerType = '立ち絵' | 'デフォルメ' | 'サイン風'
type BookColor = 'pink' | 'mint' | 'violet' | 'sky' | 'lemon' | 'coral' | 'mono' | 'night'
type BookShape = 'classic' | 'round' | 'game' | 'square' | 'diary'
type BookPattern = 'check' | 'stars' | 'plain' | 'dots' | 'stripe' | 'grid'

type FavoriteKey =
  | 'food' | 'drink' | 'animal' | 'color'
  | 'anime' | 'game' | 'music' | 'hobby'

type BloodType = '' | 'A' | 'B' | 'O' | 'AB'

type Profile = {
  displayName: string
  accountId: string
  likes: string
  activity: string
  message: string
  nickname: string
  birthMonth: string
  birthDay: string
  bloodType: BloodType
  personality: string
  favorites: Record<FavoriteKey, string>
  freeSpace: string
  avatar: AvatarId
  customAvatar?: string
  bookColor: BookColor
  bookShape: BookShape
  bookPattern: BookPattern
}

type Sticker = {
  id: number
  name: string
  type: StickerType
  className: string
  symbol: string
  message?: string
  isMine?: boolean
}

type StickerDesign = Pick<Sticker, 'type' | 'className' | 'symbol'> & {
  id: string
  label: string
}

const favoriteOptions: { id: FavoriteKey; label: string }[] = [
  { id: 'food', label: '食べ物' },
  { id: 'drink', label: '飲み物' },
  { id: 'animal', label: '動物' },
  { id: 'color', label: '色' },
  { id: 'anime', label: 'アニメ' },
  { id: 'game', label: 'ゲーム' },
  { id: 'music', label: '音楽' },
  { id: 'hobby', label: 'しゅみ' },
]

const bloodTypeOptions: BloodType[] = ['A', 'B', 'O', 'AB']

const emptyFavorites: Record<FavoriteKey, string> = {
  food: '', drink: '', animal: '', color: '',
  anime: '', game: '', music: '', hobby: '',
}

const zodiacBorders: { month: number; day: number; name: string }[] = [
  { month: 1, day: 20, name: 'みずがめ' },
  { month: 2, day: 19, name: 'うお' },
  { month: 3, day: 21, name: 'おひつじ' },
  { month: 4, day: 20, name: 'おうし' },
  { month: 5, day: 21, name: 'ふたご' },
  { month: 6, day: 22, name: 'かに' },
  { month: 7, day: 23, name: 'しし' },
  { month: 8, day: 23, name: 'おとめ' },
  { month: 9, day: 23, name: 'てんびん' },
  { month: 10, day: 24, name: 'さそり' },
  { month: 11, day: 23, name: 'いて' },
  { month: 12, day: 22, name: 'やぎ' },
]

function zodiacOf(monthText: string, dayText: string) {
  const month = Number(monthText)
  const day = Number(dayText)
  if (!month || !day) return ''
  const border = zodiacBorders[month - 1]
  if (!border) return ''
  if (day >= border.day) return border.name
  return zodiacBorders[(month + 10) % 12].name
}

const initialProfile: Profile = {
  displayName: '星乃 しぃ',
  accountId: '@shii',
  likes: 'クリームソーダ・星空・ゲーム音楽',
  activity: 'ゲーム配信とイラストをゆるっと更新中！',
  message: '見つけてくれてありがとう。いっしょに楽しい思い出つくろ〜！',
  nickname: 'しぃ',
  birthMonth: '',
  birthDay: '',
  bloodType: '',
  personality: '',
  favorites: { ...emptyFavorites, drink: 'クリームソーダ', game: 'リズムゲーム', music: 'ゲーム音楽' },
  freeSpace: '',
  avatar: 'violet',
  bookColor: 'pink',
  bookShape: 'classic',
  bookPattern: 'check',
}

const avatarOptions: { id: AvatarId; label: string }[] = [
  { id: 'violet', label: 'むらさき' },
  { id: 'mint', label: 'ミント' },
  { id: 'peach', label: 'ピーチ' },
]

const bookColorOptions: { id: BookColor; label: string; color: string }[] = [
  { id: 'pink', label: 'いちごピンク', color: '#f291b2' },
  { id: 'mint', label: 'ソーダミント', color: '#67cdbd' },
  { id: 'violet', label: 'ゆめパープル', color: '#9b7bd4' },
  { id: 'sky', label: '青春ブルー', color: '#72a9df' },
  { id: 'lemon', label: 'レモンキャンディ', color: '#edc957' },
  { id: 'coral', label: '夕焼けコーラル', color: '#e98273' },
  { id: 'mono', label: '制服モノクロ', color: '#7e7882' },
  { id: 'night', label: '深夜ネイビー', color: '#3e4d86' },
]

const bookShapeOptions: { id: BookShape; label: string }[] = [
  { id: 'classic', label: 'プロフィール帳' },
  { id: 'round', label: 'まるカド' },
  { id: 'game', label: 'ゲームパネル' },
  { id: 'square', label: 'スクエア' },
  { id: 'diary', label: 'ひみつ日記' },
]

const bookPatternOptions: { id: BookPattern; label: string }[] = [
  { id: 'check', label: 'チェック' },
  { id: 'stars', label: 'きらきら' },
  { id: 'plain', label: 'シンプル' },
  { id: 'dots', label: '水玉' },
  { id: 'stripe', label: 'ボーダー' },
  { id: 'grid', label: '方眼ノート' },
]

const defaultStickers: Sticker[] = [
  { id: 1, name: '放課後ヒロイン', type: '立ち絵', className: 'sticker--stand-pink', symbol: '✦' },
  { id: 2, name: 'ゆるねこ', type: 'デフォルメ', className: 'sticker--chibi-mint', symbol: 'ฅ' },
  { id: 3, name: 'HIKARI', type: 'サイン風', className: 'sticker--sign-blue', symbol: 'H!' },
  { id: 4, name: '制服スタイル', type: '立ち絵', className: 'sticker--stand-blue', symbol: '★' },
  { id: 5, name: 'ちび天使', type: 'デフォルメ', className: 'sticker--chibi-yellow', symbol: '♡' },
  { id: 6, name: 'しぃサイン', type: 'サイン風', className: 'sticker--sign-pink', symbol: 'しぃ' },
]

const publicProfile: Profile = {
  displayName: '星乃しぃ',
  accountId: '@shii',
  likes: 'クリームソーダ・星空・ゲーム音楽',
  activity: 'ゲーム配信とイラストをゆるっと更新中！',
  message: '見つけてくれてありがとう。記念のシール、受け取ってね！',
  nickname: 'しぃ',
  birthMonth: '7',
  birthDay: '7',
  bloodType: 'O',
  personality: 'マイペース',
  favorites: {
    ...emptyFavorites,
    food: 'いちごのスイーツ',
    drink: 'クリームソーダ',
    animal: 'ねこ',
    color: 'ラベンダー',
    anime: '魔法少女もの',
    game: 'リズムゲーム',
    music: 'ゲーム音楽',
    hobby: 'イラスト・星空さんぽ',
  },
  freeSpace: 'ゲーム配信とイラストをゆるっと更新中！遊びにきてね✦',
  avatar: 'violet',
  bookColor: 'violet',
  bookShape: 'round',
  bookPattern: 'stars',
}

const publicSticker: Sticker = {
  id: 1001,
  name: 'しぃのきらめき',
  type: '立ち絵',
  className: 'sticker--stand-purple',
  symbol: '✦',
  message: '出会えた記念だよ！これからもよろしくね ♡',
}

const MY_STICKER_ID = 1000

function accountSlug(accountId: string) {
  return accountId.replace(/^@/, '').trim().toLowerCase() || 'shii'
}

function canonicalSlug(accountId: string) {
  const slug = accountSlug(accountId)
  if (slug === 'mio' || slug === 'mio_hoshi') return 'shii'
  return slug
}

function publicProfilePath(accountId: string) {
  return `/p/${encodeURIComponent(canonicalSlug(accountId))}`
}

function publicProfileUrl(accountId: string) {
  const path = `${import.meta.env.BASE_URL.replace(/\/$/, '')}${publicProfilePath(accountId)}`
  if (typeof window === 'undefined') return path
  return `${window.location.origin}${path}`
}

function compressImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('read'))
    reader.onload = () => {
      const dataUrl = reader.result
      if (typeof dataUrl !== 'string') {
        reject(new Error('read'))
        return
      }
      const image = new Image()
      image.onerror = () => reject(new Error('image'))
      image.onload = () => {
        const maxSize = 480
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        const context = canvas.getContext('2d')
        if (!context) {
          resolve(dataUrl)
          return
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.86))
      }
      image.src = dataUrl
    }
    reader.readAsDataURL(file)
  })
}

const stickerDesigns: StickerDesign[] = [
  { id: 'stand-pink', label: 'きらめきピンク', type: '立ち絵', className: 'sticker--stand-pink', symbol: '✦' },
  { id: 'stand-blue', label: 'スクールブルー', type: '立ち絵', className: 'sticker--stand-blue', symbol: '★' },
  { id: 'stand-purple', label: 'ドリームパープル', type: '立ち絵', className: 'sticker--stand-purple', symbol: '☾' },
  { id: 'chibi-mint', label: 'まるねこミント', type: 'デフォルメ', className: 'sticker--chibi-mint', symbol: 'ฅ' },
  { id: 'chibi-yellow', label: 'ちび天使イエロー', type: 'デフォルメ', className: 'sticker--chibi-yellow', symbol: '♡' },
  { id: 'chibi-pink', label: 'うさぎピンク', type: 'デフォルメ', className: 'sticker--chibi-pink', symbol: 'ᕱ' },
  { id: 'sign-blue', label: 'クールサイン', type: 'サイン風', className: 'sticker--sign-blue', symbol: 'H!' },
  { id: 'sign-pink', label: 'ふわ文字サイン', type: 'サイン風', className: 'sticker--sign-pink', symbol: 'しぃ' },
  { id: 'sign-mint', label: 'きらきらサイン', type: 'サイン風', className: 'sticker--sign-mint', symbol: 'M☆' },
]

const stickerTypes: StickerType[] = ['立ち絵', 'デフォルメ', 'サイン風']

const bookStyleClasses = (profile: Profile) => (
  `book-color--${profile.bookColor} book-shape--${profile.bookShape} book-pattern--${profile.bookPattern}`
)

function Avatar({
  avatar,
  label,
  imageSrc,
}: {
  avatar: AvatarId
  label: string
  imageSrc?: string
}) {
  return (
    <div
      className={`avatar-face avatar--${avatar}${imageSrc ? ' avatar--custom' : ''}`}
      aria-label={label}
    >
      {imageSrc ? (
        <img src={imageSrc} alt="" />
      ) : (
        <>
          <span className="avatar-hair" />
          <span className="avatar-eyes">•ᴗ•</span>
        </>
      )}
    </div>
  )
}

function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()

  useEffect(() => {
    document.querySelector<HTMLElement>('.app-main')?.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="app-stage">
      <div className="app-shell">
        <header className="app-header">
          <Link className="brand" to="/" aria-label="ぷろぺた ホーム">
            <span className="brand-star">✦</span>
            <span>ぷろぺた</span>
          </Link>
          <span className="demo-badge">DEMO</span>
        </header>
        <main className="app-main">{children}</main>
        <nav className="bottom-nav" aria-label="メインナビゲーション">
          <NavLink to="/" end>
            <span aria-hidden="true">⌂</span>
            ホーム
          </NavLink>
          <NavLink to="/profile">
            <span aria-hidden="true">▤</span>
            ぷろふ
          </NavLink>
          <NavLink to="/stickers">
            <span aria-hidden="true">✿</span>
            シール帳
          </NavLink>
        </nav>
      </div>
    </div>
  )
}

function HomePage({ profile, stickerCount }: { profile: Profile; stickerCount: number }) {
  const shortName = profile.displayName.replace(/\s/g, '').slice(-2) || 'しぃ'

  return (
    <section className="home-page page-enter">
      <div className="desk">
        <span className="desk-tape tape-one" aria-hidden="true" />
        <span className="desk-tape tape-two" aria-hidden="true" />
        <div className="memo-card" aria-hidden="true">
          <span>きょうも</span>
          <strong>よろしくね！</strong>
          <span className="memo-heart">♡</span>
        </div>

        <div className="book-scene">
          <div className="book-shadow" />
          <article className={`profile-book ${bookStyleClasses(profile)}`}>
            <span className="book-ring ring-one" />
            <span className="book-ring ring-two" />
            <span className="book-ring ring-three" />
            <p className="book-label">MY PROFILE BOOK</p>
            <div
              className={`book-avatar book-avatar--${profile.avatar}${profile.customAvatar ? ' book-avatar--custom' : ''}`}
              aria-hidden="true"
            >
              {profile.customAvatar ? (
                <img src={profile.customAvatar} alt="" />
              ) : (
                <span>{shortName.charAt(0)}</span>
              )}
            </div>
            <h1>{shortName}の<br />ぷろふ帳</h1>
            <p className="book-subtitle">なかよくしてね ♡</p>
            <span className="cover-sticker cover-star">★</span>
            <span className="cover-sticker cover-heart">♥</span>
            <span className="cover-sticker cover-flower">✿</span>
          </article>
        </div>

        <Link className="primary-button open-button" to="/profile">
          <span>プロフィール帳をひらく</span>
          <span aria-hidden="true">›</span>
        </Link>

        <div className="sticker-counter">
          <span className="counter-icon" aria-hidden="true">✿</span>
          <span>あつめたシール</span>
          <strong>{stickerCount}</strong>
          <span>まい</span>
        </div>
      </div>
    </section>
  )
}

function ShareProfileCard({ shareUrl }: { shareUrl: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [copyState, setCopyState] = useState({ url: shareUrl, status: 'idle' as 'idle' | 'copied' | 'error' })
  const copyStatus = copyState.url === shareUrl ? copyState.status : 'idle'
  const setCopyStatus = (status: 'idle' | 'copied' | 'error') => {
    setCopyState({ url: shareUrl, status })
  }
  const shareCardRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const animationFrame = requestAnimationFrame(() => {
      shareCardRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' })
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [isOpen])

  const copyPublicUrl = async () => {
    setCopyStatus('copied')

    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      const copied = document.execCommand('copy')
      textArea.remove()
      if (!copied) setCopyStatus('error')
    }
  }

  return (
    <aside className="share-card" ref={shareCardRef}>
      <button type="button" onClick={() => setIsOpen((current) => !current)}>
        <span aria-hidden="true">↗</span>
        <span>わたしのぷろぺたをシェア</span>
        <span aria-hidden="true">{isOpen ? '−' : '＋'}</span>
      </button>
      {isOpen && (
        <div className="share-url">
          <div className="share-qr" aria-label="公開プロフィールのQRコード">
            <QRCodeSVG
              value={shareUrl}
              size={132}
              level="M"
              bgColor="#fffdf8"
              fgColor="#4a3442"
              marginSize={2}
            />
          </div>
          <div className="share-url-content">
            <small>PUBLIC PROFILE URL</small>
            <code>{shareUrl}</code>
            <button type="button" className="copy-url-button" onClick={copyPublicUrl}>
              <span aria-hidden="true">{copyStatus === 'copied' ? '✓' : '▣'}</span>
              {copyStatus === 'copied' ? 'コピーしました' : 'URLをコピー'}
            </button>
            <p className="copy-status" aria-live="polite">
              {copyStatus === 'error' ? 'コピーできませんでした。URLを長押ししてください。' : ''}
            </p>
          </div>
        </div>
      )}
    </aside>
  )
}

function Blank({ value }: { value: string }) {
  return <span className={`blank${value ? '' : ' blank--empty'}`}>{value || '\u3000\u3000'}</span>
}

function ProfileDetails({ profile }: { profile: Profile }) {
  const zodiac = zodiacOf(profile.birthMonth, profile.birthDay)
  const hasBirthday = Boolean(profile.birthMonth || profile.birthDay)
  const filledFavorites = favoriteOptions.filter((option) => profile.favorites[option.id])

  return (
    <>
      {(profile.nickname || hasBirthday || profile.bloodType || profile.personality) && (
        <div className="fill-lines">
          {profile.nickname && (
            <p>みんなには<Blank value={profile.nickname} />ってよばれてるよ</p>
          )}
          {hasBirthday && (
            <p>
              たんじょう日は<Blank value={profile.birthMonth} />月
              <Blank value={profile.birthDay} />日{zodiac && <>（{zodiac}座）</>}
            </p>
          )}
          {profile.bloodType && (
            <p>血液型は<Blank value={profile.bloodType} />型</p>
          )}
          {profile.personality && (
            <p>よく<Blank value={profile.personality} />って言われるよ</p>
          )}
        </div>
      )}

      {filledFavorites.length > 0 && (
        <div className="favorite-section">
          <h2 className="favorite-title">♡ MY FAVORITE</h2>
          <ul className="favorite-grid">
            {filledFavorites.map((option) => (
              <li key={option.id}>
                <span>{option.label}</span>
                <strong>{profile.favorites[option.id]}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      {profile.freeSpace && (
        <div className="free-space">
          <h2>FREE SPACE</h2>
          <p>{profile.freeSpace}</p>
        </div>
      )}
    </>
  )
}

function ProfilePage({ profile }: { profile: Profile }) {
  return (
    <section className={`profile-page page-enter book-theme ${bookStyleClasses(profile)}`}>
      <div className="page-heading">
        <div>
          <p className="eyebrow">PROFILE BOOK</p>
          <h1>{profile.displayName}のプロフィール</h1>
        </div>
        <Link className="mini-action" to="/profile/edit">✎ 編集</Link>
      </div>

      <article className={`open-book ${bookStyleClasses(profile)}`}>
        <div className="book-spine" aria-hidden="true" />
        <div className="profile-top">
          <div className="profile-photo">
            <Avatar
              avatar={profile.avatar}
              imageSrc={profile.customAvatar}
              label={`${profile.displayName}のアイコン`}
            />
            <span className="photo-tape" aria-hidden="true" />
          </div>
          <div className="name-block">
            <span>なまえ</span>
            <strong>{profile.displayName}</strong>
            <em>{profile.accountId}</em>
          </div>
        </div>

        <dl className="profile-fields">
          <div>
            <dt><span>♡</span> すきなもの</dt>
            <dd>{profile.likes}</dd>
          </div>
          <div>
            <dt><span>☆</span> 活動内容</dt>
            <dd>{profile.activity}</dd>
          </div>
          <div className="message-field">
            <dt><span>✎</span> ひとこと</dt>
            <dd>{profile.message}</dd>
          </div>
        </dl>
        <ProfileDetails profile={profile} />

        <div className="profile-doodles" aria-hidden="true">
          <span>✦</span><span>♡</span><span>キラキラ</span>
        </div>
      </article>

      <div className="profile-actions">
        <Link className="primary-button" to="/stickers">
          <span>シール帳を見る</span>
          <span aria-hidden="true">›</span>
        </Link>
        <Link className="secondary-button" to="/stickers/create">
          <span aria-hidden="true">✦</span>
          配るシールをつくる
        </Link>
      </div>
      <ShareProfileCard shareUrl={publicProfileUrl(profile.accountId)} />
      <p className="page-hint">プロフィールの内容は「編集」から書きかえられるよ</p>
    </section>
  )
}

function EditProfilePage({
  profile,
  onSave,
}: {
  profile: Profile
  onSave: (profile: Profile) => void
}) {
  const [draft, setDraft] = useState(profile)
  const [avatarError, setAvatarError] = useState('')
  const navigate = useNavigate()

  const updateField = <K extends keyof Profile>(field: K, value: Profile[K]) => {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  const updateFavorite = (key: FavoriteKey, value: string) => {
    setDraft((current) => ({ ...current, favorites: { ...current.favorites, [key]: value } }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedId = draft.accountId.startsWith('@') ? draft.accountId : `@${draft.accountId}`
    onSave({ ...draft, accountId: normalizedId })
    navigate('/profile')
  }

  const handleAvatarImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return
    if (!file.type.startsWith('image/')) {
      setAvatarError('画像ファイルを選んでください')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('5MB以下の画像を選んでください')
      return
    }

    void compressImageFile(file)
      .then((dataUrl) => {
        setDraft((current) => ({ ...current, customAvatar: dataUrl }))
        setAvatarError('')
      })
      .catch(() => setAvatarError('画像を読み込めませんでした'))
  }

  return (
    <section className="edit-page page-enter">
      <div className="page-heading">
        <div>
          <p className="eyebrow">WRITE MY PROFILE</p>
          <h1>プロフィールを書く</h1>
        </div>
        <Link className="close-link" to="/profile" aria-label="編集を閉じる">×</Link>
      </div>

      <form className="notebook-form" onSubmit={handleSubmit}>
        <fieldset className="book-customizer">
          <legend>プロフィール帳をデザイン</legend>
          <div className={`book-style-preview ${bookStyleClasses(draft)}`}>
            <span className="preview-book-ring ring-top" />
            <span className="preview-book-ring ring-bottom" />
            <small>MY PROFILE BOOK</small>
            <strong>{draft.displayName || 'なまえ'}の<br />ぷろふ帳</strong>
            <span className="preview-book-mark">✦</span>
          </div>

          <div className="custom-control">
            <span className="custom-label">カラー</span>
            <div className="color-options">
              {bookColorOptions.map((option) => (
                <label key={option.id} className={draft.bookColor === option.id ? 'selected' : ''}>
                  <input
                    type="radio"
                    name="bookColor"
                    checked={draft.bookColor === option.id}
                    onChange={() => updateField('bookColor', option.id)}
                  />
                  <span className="color-swatch" style={{ background: option.color }} />
                  <small>{option.label}</small>
                </label>
              ))}
            </div>
          </div>

          <div className="custom-control">
            <span className="custom-label">表紙の形</span>
            <div className="shape-options">
              {bookShapeOptions.map((option) => (
                <label key={option.id} className={draft.bookShape === option.id ? 'selected' : ''}>
                  <input
                    type="radio"
                    name="bookShape"
                    checked={draft.bookShape === option.id}
                    onChange={() => updateField('bookShape', option.id)}
                  />
                  <span className={`shape-sample shape-sample--${option.id}`} />
                  <small>{option.label}</small>
                </label>
              ))}
            </div>
          </div>

          <div className="custom-control">
            <span className="custom-label">もよう</span>
            <div className="pattern-options">
              {bookPatternOptions.map((option) => (
                <label key={option.id} className={draft.bookPattern === option.id ? 'selected' : ''}>
                  <input
                    type="radio"
                    name="bookPattern"
                    checked={draft.bookPattern === option.id}
                    onChange={() => updateField('bookPattern', option.id)}
                  />
                  <span className={`pattern-sample pattern-sample--${option.id}`} />
                  <small>{option.label}</small>
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        <fieldset className="avatar-picker">
          <legend>アイコンをえらぶ</legend>
          <div className={`custom-avatar-upload${draft.customAvatar ? ' has-image' : ''}`}>
            <Avatar
              avatar={draft.avatar}
              imageSrc={draft.customAvatar}
              label="選択したユーザー画像のプレビュー"
            />
            <div>
              <strong>自分の画像をつかう</strong>
              <small>JPG・PNG・WebP / 5MBまで</small>
              <label className="image-select-button">
                <input type="file" accept="image/*" onChange={handleAvatarImage} />
                <span aria-hidden="true">▧</span>
                {draft.customAvatar ? '画像を選びなおす' : '画像を選ぶ'}
              </label>
              {draft.customAvatar && (
                <button
                  type="button"
                  className="remove-image-button"
                  onClick={() => setDraft((current) => ({ ...current, customAvatar: undefined }))}
                >
                  仮アイコンに戻す
                </button>
              )}
            </div>
          </div>
          {avatarError && <p className="avatar-error" role="alert">{avatarError}</p>}
          <p className="avatar-divider"><span>または仮アイコン</span></p>
          <div className="avatar-options">
            {avatarOptions.map((option) => (
              <label key={option.id} className={draft.avatar === option.id ? 'selected' : ''}>
                <input
                  type="radio"
                  name="avatar"
                  value={option.id}
                  checked={draft.avatar === option.id}
                  onChange={() => setDraft((current) => ({
                    ...current,
                    avatar: option.id,
                    customAvatar: undefined,
                  }))}
                />
                <Avatar avatar={option.id} label={`${option.label}の仮アイコン`} />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="form-field">
          <span>表示名</span>
          <input
            required
            maxLength={20}
            value={draft.displayName}
            onChange={(event) => updateField('displayName', event.target.value)}
          />
        </label>
        <label className="form-field">
          <span>@ID</span>
          <input
            required
            maxLength={24}
            value={draft.accountId}
            onChange={(event) => updateField('accountId', event.target.value)}
          />
        </label>
        <label className="form-field">
          <span>好きなもの</span>
          <textarea
            required
            rows={2}
            maxLength={80}
            value={draft.likes}
            onChange={(event) => updateField('likes', event.target.value)}
          />
        </label>
        <label className="form-field">
          <span>活動内容</span>
          <textarea
            required
            rows={2}
            maxLength={100}
            value={draft.activity}
            onChange={(event) => updateField('activity', event.target.value)}
          />
        </label>
        <label className="form-field">
          <span>ひとこと</span>
          <textarea
            required
            rows={3}
            maxLength={120}
            value={draft.message}
            onChange={(event) => updateField('message', event.target.value)}
          />
        </label>

        <fieldset className="detail-fields">
          <legend>もっと知ってもらう（ぜんぶ空でもOK）</legend>
          <label className="form-field">
            <span>よばれ方</span>
            <input
              maxLength={12}
              placeholder="例：しぃ、ひろちゃん"
              value={draft.nickname}
              onChange={(event) => updateField('nickname', event.target.value)}
            />
          </label>
          <div className="form-field form-field--row">
            <span>たんじょう日</span>
            <div className="birthday-select">
              <select
                aria-label="誕生月"
                value={draft.birthMonth}
                onChange={(event) => updateField('birthMonth', event.target.value)}
              >
                <option value="">--</option>
                {Array.from({ length: 12 }, (_, index) => String(index + 1)).map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              月
              <select
                aria-label="誕生日"
                value={draft.birthDay}
                onChange={(event) => updateField('birthDay', event.target.value)}
              >
                <option value="">--</option>
                {Array.from({ length: 31 }, (_, index) => String(index + 1)).map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              日
            </div>
          </div>
          <div className="form-field form-field--row">
            <span>血液型</span>
            <div className="chip-options">
              {bloodTypeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={draft.bloodType === type ? 'selected' : ''}
                  aria-pressed={draft.bloodType === type}
                  onClick={() => updateField('bloodType', draft.bloodType === type ? '' : type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <label className="form-field">
            <span>よく言われること</span>
            <input
              maxLength={16}
              placeholder="例：マイペース、おっとり"
              value={draft.personality}
              onChange={(event) => updateField('personality', event.target.value)}
            />
          </label>
        </fieldset>

        <fieldset className="detail-fields">
          <legend>♡ MY FAVORITE（書けるところだけでOK）</legend>
          <div className="favorite-inputs">
            {favoriteOptions.map((option) => (
              <label key={option.id} className="form-field">
                <span>{option.label}</span>
                <input
                  maxLength={16}
                  value={draft.favorites[option.id]}
                  onChange={(event) => updateFavorite(option.id, event.target.value)}
                />
              </label>
            ))}
          </div>
        </fieldset>

        <label className="form-field">
          <span>フリースペース</span>
          <textarea
            rows={3}
            maxLength={150}
            placeholder="自由に書いてね"
            value={draft.freeSpace}
            onChange={(event) => updateField('freeSpace', event.target.value)}
          />
        </label>

        <button className="save-button" type="submit">
          <span>書いた内容を保存</span>
          <span aria-hidden="true">✓</span>
        </button>
        <p className="form-note">このブラウザに保存されるよ。別の端末にはまだ引き継がれない</p>
      </form>
    </section>
  )
}

function StickerCard({
  sticker,
  onSelect,
}: {
  sticker: Sticker
  onSelect: (sticker: Sticker) => void
}) {
  return (
    <button
      className={`sticker-slot${sticker.isMine ? ' sticker-slot--mine' : ''}`}
      type="button"
      onClick={() => onSelect(sticker)}
      aria-label={`${sticker.name}を大きく表示`}
    >
      {sticker.isMine && <span className="mine-label">わたしのシール</span>}
      <span className={`sticker-art ${sticker.className}`}>
        <span>{sticker.symbol}</span>
      </span>
      <strong>{sticker.name}</strong>
      <small>{sticker.type}</small>
    </button>
  )
}

function StickersPage({ stickers, ownerName }: { stickers: Sticker[]; ownerName: string }) {
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null)

  return (
    <section className="stickers-page page-enter">
      <div className="page-heading">
        <div>
          <p className="eyebrow">STICKER ALBUM</p>
          <h1>{ownerName}のシール帳</h1>
        </div>
        <span className="collection-count">{stickers.length}/12</span>
      </div>

      <Link className="create-sticker-banner" to="/stickers/create">
        <span className="banner-icon" aria-hidden="true">✦</span>
        <span><strong>配るシールをつくる</strong><small>デザインをえらんで作成</small></span>
        <span aria-hidden="true">›</span>
      </Link>

      <div className="album-page">
        <span className="album-ring album-ring-one" aria-hidden="true" />
        <span className="album-ring album-ring-two" aria-hidden="true" />
        <div className="sticker-grid">
          {stickers.map((sticker, index) => (
            <StickerCard key={`${sticker.id}-${index}`} sticker={sticker} onSelect={setSelectedSticker} />
          ))}
        </div>
      </div>
      <p className="page-hint">シールをタップすると大きく見られるよ</p>

      {selectedSticker && (
        <div
          className="sticker-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="sticker-title"
          onClick={() => setSelectedSticker(null)}
        >
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <button
              className="close-button"
              type="button"
              onClick={() => setSelectedSticker(null)}
              aria-label="閉じる"
            >
              ×
            </button>
            {selectedSticker.isMine && <span className="modal-mine-label">MY STICKER</span>}
            <span className={`sticker-art sticker-art--large ${selectedSticker.className}`}>
              <span>{selectedSticker.symbol}</span>
            </span>
            <p>{selectedSticker.type}</p>
            <h2 id="sticker-title">{selectedSticker.name}</h2>
            {selectedSticker.message && <blockquote>{selectedSticker.message}</blockquote>}
            <span className="rarity">✦ RARE STICKER ✦</span>
          </div>
        </div>
      )}
    </section>
  )
}

function CreateStickerPage({ onSave }: { onSave: (sticker: Sticker) => void }) {
  const [selectedType, setSelectedType] = useState<StickerType>('立ち絵')
  const [selectedDesignId, setSelectedDesignId] = useState(stickerDesigns[0].id)
  const [name, setName] = useState('しぃのキラシール')
  const [message, setMessage] = useState('見つけてくれてありがとう！')
  const navigate = useNavigate()
  const visibleDesigns = stickerDesigns.filter((design) => design.type === selectedType)
  const selectedDesign =
    stickerDesigns.find((design) => design.id === selectedDesignId) ?? visibleDesigns[0]

  const selectType = (type: StickerType) => {
    setSelectedType(type)
    const firstDesign = stickerDesigns.find((design) => design.type === type)
    if (firstDesign) setSelectedDesignId(firstDesign.id)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave({
      id: MY_STICKER_ID,
      name,
      message,
      type: selectedDesign.type,
      className: selectedDesign.className,
      symbol: selectedDesign.symbol,
      isMine: true,
    })
    navigate('/stickers')
  }

  return (
    <section className="create-page page-enter">
      <div className="page-heading">
        <div>
          <p className="eyebrow">MAKE MY STICKER</p>
          <h1>配るシールをつくる</h1>
        </div>
        <Link className="close-link" to="/stickers" aria-label="シール作成を閉じる">×</Link>
      </div>

      <form className="sticker-maker" onSubmit={handleSubmit}>
        <div className="sticker-preview-card">
          <span className="preview-label">PREVIEW</span>
          <span className={`sticker-art sticker-art--preview ${selectedDesign.className}`}>
            <span>{selectedDesign.symbol}</span>
          </span>
          <strong>{name || 'シール名'}</strong>
          <p>{message || 'ひとことメッセージ'}</p>
        </div>

        <fieldset className="maker-section">
          <legend><span>1</span> シールの種類</legend>
          <div className="type-tabs">
            {stickerTypes.map((type) => (
              <button
                key={type}
                type="button"
                className={selectedType === type ? 'selected' : ''}
                onClick={() => selectType(type)}
              >
                {type}シール
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="maker-section">
          <legend><span>2</span> デザイン</legend>
          <div className="design-options">
            {visibleDesigns.map((design) => (
              <label key={design.id} className={selectedDesignId === design.id ? 'selected' : ''}>
                <input
                  type="radio"
                  name="design"
                  checked={selectedDesignId === design.id}
                  onChange={() => setSelectedDesignId(design.id)}
                />
                <span className={`sticker-art sticker-art--choice ${design.className}`}>
                  <span>{design.symbol}</span>
                </span>
                <small>{design.label}</small>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="maker-section maker-fields">
          <div className="section-title"><span>3</span> 文字をいれる</div>
          <label className="form-field">
            <span>シール名</span>
            <input
              required
              maxLength={20}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="form-field">
            <span>一言メッセージ</span>
            <textarea
              required
              rows={2}
              maxLength={60}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>
        </div>

        <button className="save-button" type="submit">
          <span>このシールにする</span>
          <span aria-hidden="true">✦</span>
        </button>
        <p className="form-note">画像アップロードはまだ使いません</p>
      </form>
    </section>
  )
}

function PublicProfilePage({ hasReceived }: { hasReceived: boolean }) {
  return (
    <section className={`public-profile-page page-enter book-theme ${bookStyleClasses(publicProfile)}`}>
      <div className="visitor-ribbon">
        <span aria-hidden="true">✦</span>
        公開プロフィール
      </div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">SHII&apos;S PROFILE BOOK</p>
          <h1>{publicProfile.displayName}のぷろぺた</h1>
        </div>
        <span className="page-number">♡</span>
      </div>

      <article className={`open-book public-book ${bookStyleClasses(publicProfile)}`}>
        <div className="book-spine" aria-hidden="true" />
        <div className="profile-top">
          <div className="profile-photo">
            <Avatar avatar={publicProfile.avatar} label={`${publicProfile.displayName}の仮アイコン`} />
            <span className="photo-tape" aria-hidden="true" />
          </div>
          <div className="name-block">
            <span>なまえ</span>
            <strong>{publicProfile.displayName}</strong>
            <em>{publicProfile.accountId}</em>
          </div>
        </div>

        <dl className="profile-fields">
          <div>
            <dt><span>♡</span> すきなもの</dt>
            <dd>{publicProfile.likes}</dd>
          </div>
          <div>
            <dt><span>☆</span> 活動内容</dt>
            <dd>{publicProfile.activity}</dd>
          </div>
          <div className="message-field">
            <dt><span>✎</span> ひとこと</dt>
            <dd>{publicProfile.message}</dd>
          </div>
        </dl>
        <ProfileDetails profile={publicProfile} />
      </article>

      <section className="public-sticker-offer">
        <div>
          <p className="eyebrow">PRESENT STICKER</p>
          <h2>配布中のシール</h2>
        </div>
        <span className={`sticker-art sticker-art--offer ${publicSticker.className}`}>
          <span>{publicSticker.symbol}</span>
        </span>
        <strong>{publicSticker.name}</strong>
        <p>{publicSticker.message}</p>
      </section>

      <Link className="receive-button" to="/p/shii/receive">
        <span aria-hidden="true">{hasReceived ? '✓' : '✦'}</span>
        <span>{hasReceived ? '受け取り状況を見る' : 'このシールを受け取る'}</span>
        <span aria-hidden="true">›</span>
      </Link>
      <p className="page-hint">ログインなしで体験できるデモページです</p>
    </section>
  )
}

function ReceiveStickerPage({
  hasReceived,
  onReceive,
}: {
  hasReceived: boolean
  onReceive: (sticker: Sticker) => void
}) {
  const navigate = useNavigate()

  const handleReceive = () => {
    if (hasReceived) {
      navigate('/p/shii/received', { state: { duplicate: true } })
      return
    }

    onReceive(publicSticker)
    navigate('/p/shii/received', { state: { duplicate: false } })
  }

  return (
    <section className="receive-page page-enter">
      <div className="delivery-heading">
        <p className="eyebrow">SPECIAL DELIVERY</p>
        <h1>
          {publicProfile.displayName}さんから<br />
          シールが届いたよ
        </h1>
        <p>封筒をひらいて中を見てみよう</p>
      </div>

      <div className="envelope-scene" aria-hidden="true">
        <div className="envelope-back" />
        <div className="delivery-card">
          <span className={`sticker-art sticker-art--delivery ${publicSticker.className}`}>
            <span>{publicSticker.symbol}</span>
          </span>
          <strong>{publicSticker.name}</strong>
          <small>{publicSticker.message}</small>
        </div>
        <div className="envelope-front" />
        <div className="envelope-flap" />
      </div>

      {hasReceived && (
        <div className="duplicate-notice" role="status">
          <span aria-hidden="true">✓</span>
          <div>
            <strong>このシールはもう持っているよ</strong>
            <small>同じシールは重複して追加されません</small>
          </div>
        </div>
      )}

      <button className="receive-button receive-button--action" type="button" onClick={handleReceive}>
        <span aria-hidden="true">{hasReceived ? '▤' : '✿'}</span>
        <span>{hasReceived ? '持っているシールを見る' : 'シール帳にしまう'}</span>
        <span aria-hidden="true">›</span>
      </button>
      <p className="destination-note">受け取り先：しぃのシール帳</p>
    </section>
  )
}

function ReceivedStickerPage({ hasReceived }: { hasReceived: boolean }) {
  const location = useLocation()
  const routeState = location.state as { duplicate?: boolean } | null
  const isDuplicate = routeState?.duplicate ?? hasReceived

  return (
    <section className="received-page page-enter">
      <div className={`paste-scene${isDuplicate ? ' paste-scene--duplicate' : ''}`}>
        <div className="paste-book">
          <span className="paste-ring ring-a" />
          <span className="paste-ring ring-b" />
          <p>MY STICKER ALBUM</p>
          <span className={`sticker-art sticker-art--pasted ${publicSticker.className}`}>
            <span>{publicSticker.symbol}</span>
          </span>
          <span className="paste-spark spark-one">✦</span>
          <span className="paste-spark spark-two">♡</span>
          <span className="paste-spark spark-three">★</span>
        </div>
      </div>

      <div className="received-message" role="status">
        <span className="received-icon">{isDuplicate ? '✓' : '✿'}</span>
        <p className="eyebrow">{isDuplicate ? 'ALREADY IN YOUR ALBUM' : 'STICKER RECEIVED!'}</p>
        <h1>{isDuplicate ? 'このシールはもう持っているよ' : 'シールをぺたっと貼ったよ！'}</h1>
        <p>
          {isDuplicate
            ? 'シール帳にある1枚をそのまま大切にしよう'
            : `${publicProfile.displayName}さんのシールが、しぃのシール帳に追加されました`}
        </p>
      </div>

      <Link className="primary-button received-link" to="/stickers">
        <span>シール帳を見にいく</span>
        <span aria-hidden="true">›</span>
      </Link>
    </section>
  )
}

const PROFILE_STORAGE_KEY = 'puropera:profile:v1'

function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!raw) return initialProfile
    const saved = JSON.parse(raw) as Partial<Profile>
    return {
      ...initialProfile,
      ...saved,
      favorites: { ...emptyFavorites, ...saved.favorites },
    }
  } catch {
    return initialProfile
  }
}

function App() {
  const [profile, setProfile] = useState(loadProfile)

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
    } catch {
      // 容量オーバーやプライベートモードでは保存をあきらめる
    }
  }, [profile])

  const [mySticker, setMySticker] = useState<Sticker | null>(null)
  const [receivedStickers, setReceivedStickers] = useState<Sticker[]>([])
  const hasReceivedPublicSticker = receivedStickers.some(
    (sticker) => sticker.id === publicSticker.id,
  )
  const stickers = [
    ...receivedStickers,
    ...(mySticker ? [mySticker] : []),
    ...defaultStickers,
  ]

  const receiveSticker = (sticker: Sticker) => {
    setReceivedStickers((current) => (
      current.some((item) => item.id === sticker.id) ? current : [sticker, ...current]
    ))
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage profile={profile} stickerCount={stickers.length} />} />
        <Route path="/profile" element={<ProfilePage profile={profile} />} />
        <Route
          path="/profile/edit"
          element={<EditProfilePage profile={profile} onSave={setProfile} />}
        />
        <Route
          path="/stickers"
          element={(
            <StickersPage
              stickers={stickers}
              ownerName={profile.displayName.replace(/\s/g, '').slice(-2) || 'しぃ'}
            />
          )}
        />
        <Route
          path="/stickers/create"
          element={<CreateStickerPage onSave={setMySticker} />}
        />
        <Route path="/p/mio" element={<Navigate to="/p/shii" replace />} />
        <Route path="/p/mio/receive" element={<Navigate to="/p/shii/receive" replace />} />
        <Route path="/p/mio/received" element={<Navigate to="/p/shii/received" replace />} />
        <Route
          path="/p/shii"
          element={<PublicProfilePage hasReceived={hasReceivedPublicSticker} />}
        />
        <Route
          path="/p/shii/receive"
          element={(
            <ReceiveStickerPage
              hasReceived={hasReceivedPublicSticker}
              onReceive={receiveSticker}
            />
          )}
        />
        <Route
          path="/p/shii/received"
          element={<ReceivedStickerPage hasReceived={hasReceivedPublicSticker} />}
        />
        <Route path="*" element={<HomePage profile={profile} stickerCount={stickers.length} />} />
      </Routes>
    </AppShell>
  )
}

export default App
