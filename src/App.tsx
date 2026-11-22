import { useEffect, useRef, useState, type ChangeEvent, type CSSProperties, type FormEvent } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import '@fontsource/mochiy-pop-one/400.css'
import '@fontsource/hachi-maru-pop/400.css'
import '@fontsource/zen-maru-gothic/500.css'
import '@fontsource/zen-maru-gothic/700.css'
import '@fontsource/zen-kurenaido/400.css'
import '@fontsource/kiwi-maru/500.css'
import '@fontsource/fredoka/latin-500.css'
import '@fontsource/fredoka/latin-600.css'
import '@fontsource/dancing-script/latin-600.css'
import '@fontsource/dancing-script/latin-700.css'
import './App.css'

type AvatarId =
  | 'cat-face' | 'rabbit-face' | 'bear' | 'teddy-bear'
  | 'strawberry' | 'cupcake' | 'candy' | 'shortcake'
  | 'glowing-star' | 'crescent-moon' | 'rainbow' | 'cherry-blossom'
type StickerType = 'どうぶつ' | 'おかし' | 'そら' | 'かざり'
type BookColor = 'pink' | 'mint' | 'violet' | 'sky' | 'lemon' | 'coral' | 'mono' | 'night'
type BookShape = 'classic' | 'round' | 'game' | 'square' | 'diary'
type BookPattern = 'check' | 'stars' | 'plain' | 'dots' | 'stripe' | 'grid'

type FavoriteKey =
  | 'food' | 'drink' | 'animal' | 'color'
  | 'anime' | 'game' | 'music' | 'hobby'
  | 'snack' | 'season' | 'place' | 'item'

type FavoriteShape = 'scallop' | 'heart' | 'round' | 'square' | 'bubble'
type SheetTheme = 'sky' | 'gingham' | 'grid' | 'minimal'
type WhichKey =
  | 'breakfast' | 'dessert' | 'snack' | 'study' | 'pet' | 'night'
  | 'season' | 'taste' | 'outing' | 'noodle' | 'kinoko' | 'time'
type WhichChoice = '' | 'a' | 'b'

type FontStyle = 'standard' | 'pop' | 'maru' | 'soft' | 'hand' | 'kiwi'
type DecorSet = 'none' | 'sweets' | 'sky' | 'cute' | 'animals'

type AnswerKey =
  | 'talent' | 'holiday' | 'charm' | 'habit' | 'morning'
  | 'subject' | 'hamari' | 'treasure' | 'word' | 'dream'
  | 'happy' | 'weak' | 'wantItem' | 'wantGo' | 'friendType' | 'friendMsg'
  | 'bestTitle' | 'best1' | 'best2' | 'best3'
  | 'lottery' | 'wish' | 'invisible' | 'island'
  | 'oshi' | 'oshiStory' | 'oshiPoint' | 'oshiMsg'
  | 'from' | 'next'

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
  answers: Record<AnswerKey, string>
  freeSpace: string
  favoriteShape: FavoriteShape
  sheetTheme: SheetTheme
  which: Record<WhichKey, WhichChoice>
  fontStyle: FontStyle
  decorSet: DecorSet
  avatar: AvatarId
  customAvatar?: string
  bookColor: BookColor
  bookShape: BookShape
  bookPattern: BookPattern
}

type Placement = {
  id: number
  stickerId: number
  x: number
  y: number
  rot: number
  size: number
}

type GuestNote = {
  id: number
  name: string
  text: string
  symbol: string
}

type Sticker = {
  id: number
  name: string
  type: StickerType
  className: string
  symbol: string
  message?: string
  from?: string
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
  { id: 'snack', label: 'お菓子' },
  { id: 'season', label: '季節' },
  { id: 'place', label: '場所' },
  { id: 'item', label: 'もちもの' },
]

const favoriteShapeOptions: { id: FavoriteShape; label: string }[] = [
  { id: 'scallop', label: '☁ くもがた' },
  { id: 'heart', label: '♡ ハート' },
  { id: 'round', label: '○ まる' },
  { id: 'square', label: '□ ふせん' },
  { id: 'bubble', label: '💬 ふきだし' },
]

const sheetThemeOptions: { id: SheetTheme; label: string }[] = [
  { id: 'sky', label: 'ゆめかわ' },
  { id: 'gingham', label: 'ギンガム' },
  { id: 'grid', label: '方眼バインダー' },
  { id: 'minimal', label: 'ミニマル' },
]

const whichQuestions: { id: WhichKey; label: string; a: string; b: string }[] = [
  { id: 'breakfast', label: '朝食は', a: 'パン派', b: 'ごはん派' },
  { id: 'dessert', label: 'デザートは', a: 'アイス派', b: 'ケーキ派' },
  { id: 'snack', label: 'おやつは', a: 'チョコ派', b: 'グミ派' },
  { id: 'study', label: '勉強は', a: '算数派', b: '国語派' },
  { id: 'pet', label: 'ペットは', a: '犬派', b: '猫派' },
  { id: 'night', label: '生活は', a: '朝型', b: '夜型' },
  { id: 'season', label: '季節は', a: '夏派', b: '冬派' },
  { id: 'taste', label: '味は', a: '甘党', b: '辛党' },
  { id: 'outing', label: '休日は', a: 'インドア', b: 'アウトドア' },
  { id: 'noodle', label: '麺は', a: 'うどん派', b: 'そば派' },
  { id: 'kinoko', label: 'お菓子は', a: 'きのこ派', b: 'たけのこ派' },
  { id: 'time', label: '行くなら', a: '過去', b: '未来' },
]

const emptyWhich: Record<WhichKey, WhichChoice> = {
  breakfast: '', dessert: '', snack: '', study: '', pet: '', night: '',
  season: '', taste: '', outing: '', noodle: '', kinoko: '', time: '',
}

const fontStyleOptions: { id: FontStyle; label: string; family: string }[] = [
  { id: 'standard', label: 'ふつう', family: 'inherit' },
  { id: 'pop', label: 'ポップ', family: "'Mochiy Pop One', sans-serif" },
  { id: 'maru', label: 'まるもじ', family: "'Hachi Maru Pop', sans-serif" },
  { id: 'soft', label: 'やわらか', family: "'Zen Maru Gothic', sans-serif" },
  { id: 'hand', label: 'てがき', family: "'Zen Kurenaido', sans-serif" },
  { id: 'kiwi', label: 'しっとり', family: "'Kiwi Maru', serif" },
]

const decorSets: Record<DecorSet, { label: string; icons: string[] }> = {
  none: { label: 'なし', icons: [] },
  sweets: { label: 'スイーツ', icons: ['strawberry', 'shortcake', 'candy', 'cupcake'] },
  sky: { label: 'そら', icons: ['glowing-star', 'crescent-moon', 'rainbow', 'cloud'] },
  cute: { label: 'ガーリー', icons: ['ribbon', 'pink-heart', 'cherry-blossom', 'teddy-bear'] },
  animals: { label: 'どうぶつ', icons: ['cat-face', 'rabbit-face', 'bear', 'paw-prints'] },
}

function DecorIcon({ set, index, className }: { set: DecorSet; index: number; className?: string }) {
  const icons = decorSets[set].icons
  if (icons.length === 0) return null
  const name = icons[index % icons.length]
  return (
    <img
      className={`decor-icon ${className ?? ''}`}
      src={`${import.meta.env.BASE_URL}decor/${name}.svg`}
      alt=""
      aria-hidden="true"
      loading="lazy"
    />
  )
}

function scallopPath() {
  const top = 'a10 10 0 0 1 20 0 '.repeat(4)
  const right = 'a9 9 0 0 1 0 18 '.repeat(4)
  const bottom = 'a10 10 0 0 1 -20 0 '.repeat(4)
  const left = 'a9 9 0 0 1 0 -18 '.repeat(4)
  return `M10 4 ${top}a6 6 0 0 1 6 6 ${right}a6 6 0 0 1 -6 6 ${bottom}a6 6 0 0 1 -6 -6 ${left}a6 6 0 0 1 6 -6Z`
}

const favoriteShapePaths: Record<FavoriteShape, string> = {
  scallop: scallopPath(),
  heart: 'M50 88C20 64 4 48 4 28 4 14 15 4 28 4c9 0 17 5 22 13C55 9 63 4 72 4c13 0 24 10 24 24 0 20-16 36-46 60Z',
  round: 'M50 3a46 43 0 1 0 .01 0Z',
  square: 'M8 6h84a3 3 0 0 1 3 3v74a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3Z',
  bubble: 'M14 4h72a10 10 0 0 1 10 10v46a10 10 0 0 1-10 10H62L50 88 38 70H14A10 10 0 0 1 4 60V14A10 10 0 0 1 14 4Z',
}

const answerGroups: { id: string; title: string }[] = [
  { id: 'basic', title: '✎ じこしょうかい（もっと）' },
  { id: 'more', title: '☆ もっと知りたい' },
  { id: 'best', title: '♛ My Best3' },
  { id: 'if', title: '✧ もしも…' },
  { id: 'oshi', title: '♡ 私の推し' },
  { id: 'pass', title: '➜ プロフ帳をまわす' },
]

const answerQuestions: { id: AnswerKey; label: string; placeholder: string; group: string }[] = [
  { id: 'talent', label: '得意なこと', placeholder: '例：はやくちことば', group: 'basic' },
  { id: 'holiday', label: '休みの日によくすること', placeholder: '例：ゲーム、おひるね', group: 'basic' },
  { id: 'charm', label: 'チャームポイント', placeholder: '例：笑った顔', group: 'basic' },
  { id: 'habit', label: 'ついやっちゃうくせ', placeholder: '例：髪をいじる', group: 'basic' },
  { id: 'morning', label: '朝おきて最初にすること', placeholder: '例：スマホをみる', group: 'basic' },
  { id: 'subject', label: 'すきな教科', placeholder: '例：体育、図工', group: 'more' },
  { id: 'hamari', label: 'いまハマってること', placeholder: '例：ゲーム、お菓子づくり', group: 'more' },
  { id: 'treasure', label: 'たからもの', placeholder: '例：友だちからの手紙', group: 'more' },
  { id: 'word', label: 'すきなことば', placeholder: '例：なんとかなる！', group: 'more' },
  { id: 'dream', label: 'しょうらいのゆめ', placeholder: '例：パティシエ', group: 'more' },
  { id: 'happy', label: 'うれしいと感じるとき', placeholder: '例：ほめられたとき', group: 'more' },
  { id: 'weak', label: '苦手なもの', placeholder: '例：おばけ、ピーマン', group: 'more' },
  { id: 'wantItem', label: 'いま欲しいもの', placeholder: '例：新しいイヤホン', group: 'more' },
  { id: 'wantGo', label: '行ってみたい場所', placeholder: '例：北海道、ディズニー', group: 'more' },
  { id: 'friendType', label: 'どんな友だちがすき？', placeholder: '例：笑いのツボが合う子', group: 'more' },
  { id: 'friendMsg', label: 'このプロフを見た人へ', placeholder: '例：仲良くしてね！', group: 'more' },
  { id: 'bestTitle', label: 'テーマ', placeholder: '例：好きなお菓子', group: 'best' },
  { id: 'best1', label: '1位', placeholder: '', group: 'best' },
  { id: 'best2', label: '2位', placeholder: '', group: 'best' },
  { id: 'best3', label: '3位', placeholder: '', group: 'best' },
  { id: 'lottery', label: 'もし宝くじが当たったら', placeholder: '例：世界一周する！', group: 'if' },
  { id: 'wish', label: 'もし願いがひとつ叶うなら', placeholder: '例：空を飛びたい', group: 'if' },
  { id: 'invisible', label: 'もし透明人間になれたら', placeholder: '例：好きな人のそばにいく', group: 'if' },
  { id: 'island', label: '無人島にひとつ持っていくなら', placeholder: '例：ギター', group: 'if' },
  { id: 'oshi', label: '私の推し', placeholder: '例：あの配信者さん', group: 'oshi' },
  { id: 'oshiStory', label: '推しとの出会い', placeholder: '例：偶然ライブ配信を見て', group: 'oshi' },
  { id: 'oshiPoint', label: '推しのすきなところ', placeholder: '例：声と笑い方', group: 'oshi' },
  { id: 'oshiMsg', label: '推しに伝えたいこと', placeholder: '例：いつもありがとう！', group: 'oshi' },
  { id: 'from', label: 'まわしてくれた人', placeholder: '例：さくらちゃん', group: 'pass' },
  { id: 'next', label: 'つぎにまわしたい人', placeholder: '例：ゆうなちゃん', group: 'pass' },
]

const emptyAnswers: Record<AnswerKey, string> = {
  talent: '', holiday: '', charm: '', habit: '', morning: '',
  subject: '', hamari: '', treasure: '', word: '', dream: '',
  happy: '', weak: '', wantItem: '', wantGo: '', friendType: '', friendMsg: '',
  bestTitle: '', best1: '', best2: '', best3: '', lottery: '', wish: '',
  invisible: '', island: '', oshi: '', oshiStory: '', oshiPoint: '', oshiMsg: '', from: '', next: '',
}

const bloodTypeOptions: BloodType[] = ['A', 'B', 'O', 'AB']

const emptyFavorites: Record<FavoriteKey, string> = {
  food: '', drink: '', animal: '', color: '',
  anime: '', game: '', music: '', hobby: '',
  snack: '', season: '', place: '', item: '',
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
  displayName: '桜井 ひなた',
  accountId: '@hinata',
  likes: 'クリームソーダ・星空・ゲーム音楽',
  activity: 'ゲーム配信とイラストをゆるっと更新中！',
  message: '見つけてくれてありがとう。いっしょに楽しい思い出つくろ〜！',
  nickname: 'ひなた',
  birthMonth: '',
  birthDay: '',
  bloodType: '',
  personality: '',
  favorites: { ...emptyFavorites, drink: 'クリームソーダ', game: 'リズムゲーム', music: 'ゲーム音楽' },
  answers: { ...emptyAnswers },
  freeSpace: '',
  favoriteShape: 'scallop',
  sheetTheme: 'sky',
  which: { ...emptyWhich },
  fontStyle: 'maru',
  decorSet: 'cute',
  avatar: 'cat-face',
  bookColor: 'pink',
  bookShape: 'classic',
  bookPattern: 'check',
}

const avatarOptions: { id: AvatarId; label: string; bg: string }[] = [
  { id: 'cat-face', label: 'ねこ', bg: '#ffe0ec' },
  { id: 'rabbit-face', label: 'うさぎ', bg: '#e9defb' },
  { id: 'bear', label: 'くま', bg: '#ffe9cf' },
  { id: 'teddy-bear', label: 'テディ', bg: '#fff0c9' },
  { id: 'strawberry', label: 'いちご', bg: '#ffe0e0' },
  { id: 'cupcake', label: 'カップケーキ', bg: '#f9e0f5' },
  { id: 'candy', label: 'キャンディ', bg: '#dff3ff' },
  { id: 'shortcake', label: 'ケーキ', bg: '#fff1e6' },
  { id: 'glowing-star', label: 'おほしさま', bg: '#e1e6ff' },
  { id: 'crescent-moon', label: '三日月', bg: '#dde5ff' },
  { id: 'rainbow', label: 'にじ', bg: '#e3f8ff' },
  { id: 'cherry-blossom', label: 'さくら', bg: '#ffe6f0' },
]

const legacyAvatars: Record<string, AvatarId> = { violet: 'cat-face', mint: 'rabbit-face', peach: 'bear' }

function resolveAvatar(id: string) {
  const known = avatarOptions.find((option) => option.id === id)
  if (known) return known
  return avatarOptions.find((option) => option.id === legacyAvatars[id]) ?? avatarOptions[0]
}

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

const decorFiles = [
  'bear', 'candy', 'cat-face', 'cherry-blossom', 'cloud', 'crescent-moon', 'cupcake', 'glowing-star',
  'paw-prints', 'pink-heart', 'rabbit-face', 'rainbow', 'ribbon', 'shortcake', 'strawberry', 'teddy-bear',
]

const defaultStickers: Sticker[] = [
  { id: 1, name: 'ねこ', type: 'どうぶつ', className: 'sticker--pink', symbol: 'cat-face', from: 'さくら', message: '今日もおつかれさま！ゆっくり休んでね' },
  { id: 2, name: 'いちご', type: 'おかし', className: 'sticker--pink', symbol: 'strawberry', from: 'ゆうな', message: 'プロフ見たよ！いちご好きなんだね、おそろい♡' },
  { id: 3, name: 'おほしさま', type: 'そら', className: 'sticker--yellow', symbol: 'glowing-star', from: 'そら', message: '配信たのしみにしてるよ☆' },
  { id: 4, name: 'くまさん', type: 'どうぶつ', className: 'sticker--yellow', symbol: 'bear', from: 'みなと', message: 'また一緒にゲームしようね！' },
  { id: 5, name: 'にじ', type: 'そら', className: 'sticker--blue', symbol: 'rainbow', from: 'りん', message: 'いつも元気をもらってます！' },
  { id: 6, name: 'さくら', type: 'かざり', className: 'sticker--pink', symbol: 'cherry-blossom', from: 'はるか', message: 'ぷろぺた交換してくれてありがとう♪' },
]

const publicProfile: Profile = {
  displayName: '桜井ひなた',
  accountId: '@hinata',
  likes: 'クリームソーダ・星空・ゲーム音楽',
  activity: 'ゲーム配信とイラストをゆるっと更新中！',
  message: '見つけてくれてありがとう。記念のシール、受け取ってね！',
  nickname: 'ひなた',
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
    snack: 'いちごグミ',
    season: '夏',
    place: '夜の海',
    item: 'おそろいのキーホルダー',
  },
  answers: {
    ...emptyAnswers,
    talent: 'ものまね',
    holiday: 'ゲームとおひるね',
    charm: '笑ったときのえくぼ',
    habit: '髪をくるくるいじる',
    morning: 'スマホで推しの投稿をみる',
    subject: '図工と音楽',
    hamari: 'リズムゲーム',
    treasure: '友だちとのプリクラ',
    word: 'なんとかなる！',
    dream: 'ゲームをつくる人',
    happy: 'ほめてもらえたとき',
    weak: 'おばけとピーマン',
    wantItem: '新しいイヤホン',
    wantGo: '北海道の雪まつり',
    friendType: '笑いのツボが合う子',
    friendMsg: '仲良くしてね！',
    bestTitle: '好きなお菓子',
    best1: 'いちごパフェ',
    best2: 'マカロン',
    best3: 'クリームソーダ味のグミ',
    lottery: '世界一周する！',
    wish: '空を飛びたい',
    invisible: '好きな配信をこっそり見にいく',
    island: 'ギター',
    oshi: 'ゲーム配信のあの子',
    oshiStory: '偶然ライブ配信を見て',
    oshiPoint: '声と笑い方',
    oshiMsg: 'いつも元気をありがとう！',
    from: 'さくらちゃん',
    next: 'ゆうなちゃん',
  },
  freeSpace: 'ゲーム配信とイラストをゆるっと更新中！遊びにきてね✦',
  favoriteShape: 'scallop',
  sheetTheme: 'sky',
  which: {
    breakfast: 'a', dessert: 'b', snack: 'a', study: 'b', pet: 'b', night: 'b',
    season: 'a', taste: 'a', outing: 'a', noodle: 'b', kinoko: 'b', time: 'b',
  },
  fontStyle: 'maru',
  decorSet: 'sky',
  avatar: 'rabbit-face',
  bookColor: 'violet',
  bookShape: 'round',
  bookPattern: 'stars',
}

const publicSticker: Sticker = {
  id: 1001,
  name: 'ひなたのいちご',
  type: 'おかし',
  className: 'sticker--pink',
  symbol: 'strawberry',
  message: '出会えた記念だよ！これからもよろしくね ♡',
}

const MY_STICKER_ID = 1000

const seedGuestNotes: GuestNote[] = [
  { id: 1, name: 'さくら', text: 'いつも配信たのしみ！これからもよろしくね♡', symbol: 'cherry-blossom' },
  { id: 2, name: 'ゆうな', text: 'おそろいのいちご、うれしかった〜！', symbol: 'strawberry' },
  { id: 3, name: 'そら', text: '今度いっしょにゲームしよ☆', symbol: 'glowing-star' },
]

const demoPlacements: Placement[] = [
  { id: 1, stickerId: 3, x: 90, y: 24, rot: 14, size: 58 },
  { id: 2, stickerId: 2, x: 9, y: 49, rot: -12, size: 62 },
  { id: 3, stickerId: 1, x: 91, y: 58, rot: 10, size: 64 },
  { id: 4, stickerId: 5, x: 86, y: 86, rot: -8, size: 68 },
  { id: 5, stickerId: 4, x: 11, y: 95, rot: 8, size: 60 },
]

const clamp = (value: number, min = 4, max = 96) => Math.min(max, Math.max(min, value))

function usePersistentState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // 保存できない環境では何もしない
    }
  }, [key, value])

  return [value, setValue] as const
}

function accountSlug(accountId: string) {
  return accountId.replace(/^@/, '').trim().toLowerCase() || 'hinata'
}

function canonicalSlug(accountId: string) {
  const slug = accountSlug(accountId)
  if (slug === 'mio' || slug === 'mio_hoshi' || slug === 'shii') return 'hinata'
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
  { id: 'cat', label: 'ねこ', type: 'どうぶつ', className: 'sticker--pink', symbol: 'cat-face' },
  { id: 'rabbit', label: 'うさぎ', type: 'どうぶつ', className: 'sticker--pink', symbol: 'rabbit-face' },
  { id: 'bear', label: 'くま', type: 'どうぶつ', className: 'sticker--pink', symbol: 'bear' },
  { id: 'teddy', label: 'テディ', type: 'どうぶつ', className: 'sticker--pink', symbol: 'teddy-bear' },
  { id: 'strawberry', label: 'いちご', type: 'おかし', className: 'sticker--pink', symbol: 'strawberry' },
  { id: 'shortcake', label: 'ショートケーキ', type: 'おかし', className: 'sticker--pink', symbol: 'shortcake' },
  { id: 'cupcake', label: 'カップケーキ', type: 'おかし', className: 'sticker--pink', symbol: 'cupcake' },
  { id: 'candy', label: 'キャンディ', type: 'おかし', className: 'sticker--pink', symbol: 'candy' },
  { id: 'star', label: 'おほしさま', type: 'そら', className: 'sticker--pink', symbol: 'glowing-star' },
  { id: 'moon', label: '三日月', type: 'そら', className: 'sticker--pink', symbol: 'crescent-moon' },
  { id: 'rainbow', label: 'にじ', type: 'そら', className: 'sticker--pink', symbol: 'rainbow' },
  { id: 'cloud', label: 'くも', type: 'そら', className: 'sticker--pink', symbol: 'cloud' },
  { id: 'ribbon', label: 'リボン', type: 'かざり', className: 'sticker--pink', symbol: 'ribbon' },
  { id: 'heart', label: 'ハート', type: 'かざり', className: 'sticker--pink', symbol: 'pink-heart' },
  { id: 'sakura', label: 'さくら', type: 'かざり', className: 'sticker--pink', symbol: 'cherry-blossom' },
  { id: 'paw', label: 'あしあと', type: 'かざり', className: 'sticker--pink', symbol: 'paw-prints' },
]

const stickerTypes: StickerType[] = ['どうぶつ', 'おかし', 'そら', 'かざり']

const bookStyleClasses = (profile: Profile) => (
  `book-color--${profile.bookColor} book-shape--${profile.bookShape} book-pattern--${profile.bookPattern} book-font--${profile.fontStyle} book-decor--${profile.decorSet}`
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
  const option = resolveAvatar(avatar)
  return (
    <div
      className={`avatar-face${imageSrc ? ' avatar--custom' : ''}`}
      style={{ '--av-bg': option.bg } as CSSProperties}
      aria-label={label}
    >
      {imageSrc ? (
        <img src={imageSrc} alt="" />
      ) : (
        <img className="avatar-emoji" src={`${import.meta.env.BASE_URL}decor/${option.id}.svg`} alt="" />
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
  const shortName = profile.nickname || profile.displayName.replace(/\s/g, '') || 'ひなた'

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
              className={`book-avatar${profile.customAvatar ? ' book-avatar--custom' : ''}`}
              style={{ '--av-bg': resolveAvatar(profile.avatar).bg } as CSSProperties}
              aria-hidden="true"
            >
              {profile.customAvatar ? (
                <img src={profile.customAvatar} alt="" />
              ) : (
                <img className="avatar-emoji" src={`${import.meta.env.BASE_URL}decor/${resolveAvatar(profile.avatar).id}.svg`} alt="" />
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

function Pill({ value, wide = false }: { value: string; wide?: boolean }) {
  return <span className={`sh-pill${wide ? ' sh-pill--wide' : ''}`}>{value}</span>
}

function ProfileSheet({
  profile,
  isPublic = false,
  overlay,
}: {
  profile: Profile
  isPublic?: boolean
  overlay?: React.ReactNode
}) {
  const a = profile.answers
  const zodiac = zodiacOf(profile.birthMonth, profile.birthDay)
  const hasBirthday = Boolean(profile.birthMonth || profile.birthDay)
  const favorites = favoriteOptions.filter((option) => profile.favorites[option.id])
  const hasWhich = whichQuestions.some((question) => profile.which[question.id])
  const hasBest = Boolean(a.best1 || a.best2 || a.best3)
  const moreLines: { label: string; value: string; tail: string }[] = [
    { label: 'すきな教科は', value: a.subject, tail: 'だよ！' },
    { label: 'いまハマってるのは', value: a.hamari, tail: 'だよ♪' },
    { label: 'たからものは', value: a.treasure, tail: 'だよ♡' },
    { label: 'すきなことばは', value: a.word, tail: 'だよ☆' },
    { label: 'うれしいと感じるのは', value: a.happy, tail: 'とき♪' },
    { label: '苦手なものは', value: a.weak, tail: 'だよ…' },
    { label: 'いま欲しいものは', value: a.wantItem, tail: 'だよ！' },
    { label: '行ってみたい場所は', value: a.wantGo, tail: 'だよ✈' },
    { label: '友だちにするなら', value: a.friendType, tail: 'な子がいいな♡' },
    { label: 'このプロフを見た人へ', value: a.friendMsg, tail: '♡' },
  ].filter((line) => line.value)
  const ifItems = [
    { q: 'もし、宝くじが当たったら？', v: a.lottery },
    { q: 'もし、願い事がひとつ叶うなら？', v: a.wish },
    { q: 'もし、透明人間になれたら？', v: a.invisible },
    { q: '無人島にひとつ持っていくなら？', v: a.island },
  ].filter((item) => item.v)

  return (
    <article className={`sheet sheet--${profile.sheetTheme} ${bookStyleClasses(profile)}${isPublic ? ' public-book' : ''}`}>
      <div className="sheet-band" aria-hidden="true" />
      <header className="sheet-head">
        <h2 className="sheet-script">my profile</h2>
        <DecorIcon set={profile.decorSet} index={2} className="decor-icon--head" />
      </header>

      <section className="sheet-intro">
        <figure className="sh-polaroid">
          <span className="sh-tape" aria-hidden="true" />
          <Avatar
            avatar={profile.avatar}
            imageSrc={profile.customAvatar}
            label={isPublic ? `${profile.displayName}の仮アイコン` : `${profile.displayName}のアイコン`}
          />
          <figcaption>{profile.accountId}</figcaption>
        </figure>
        <div className="sh-lines">
          <p>ぼく・わたしのなまえは<Pill value={profile.displayName} wide />です。</p>
          {profile.nickname && <p>みんなからは<Pill value={profile.nickname} />ってよばれてるよ！</p>}
          {hasBirthday && (
            <p>
              誕生日は<Pill value={profile.birthMonth || '　'} />月<Pill value={profile.birthDay || '　'} />日生まれ
              {zodiac && <>の<Pill value={zodiac} />座</>}
            </p>
          )}
          {profile.bloodType && <p>血液型は<Pill value={profile.bloodType} />型★</p>}
          {a.talent && <p>得意なことは<Pill value={a.talent} wide />だよ！</p>}
          {profile.personality && <p>性格はよく<Pill value={profile.personality} wide />って言われるよ！</p>}
          {a.holiday && <p>休みの日は<Pill value={a.holiday} wide />をしていることが多いよ！</p>}
          {a.charm && <p>チャームポイントは<Pill value={a.charm} wide />だよ♡</p>}
          {a.habit && <p>ついやっちゃうくせは<Pill value={a.habit} wide />だよ！</p>}
          {a.morning && <p>朝おきて最初に<Pill value={a.morning} wide />するよ。</p>}
          {profile.activity && <p>活動内容は<Pill value={profile.activity} wide />だよ♪</p>}
          {profile.likes && <p>すきなものは<Pill value={profile.likes} wide />だよ♡</p>}
        </div>
      </section>

      {favorites.length > 0 && (
        <section className="sh-section">
          <div className="sh-section-title">
            <small>すきなもの</small>
            <h3 className="sheet-script">my favorite</h3>
            <DecorIcon set={profile.decorSet} index={0} className="decor-icon--fav" />
          </div>
          <ul className={`sh-fav sh-fav--${profile.favoriteShape}`}>
            {favorites.map((option) => (
              <li key={option.id}>
                <svg viewBox="0 0 100 92" aria-hidden="true" preserveAspectRatio="none">
                  <path d={favoriteShapePaths[profile.favoriteShape]} />
                </svg>
                <span className="sh-fav-label">{option.label}</span>
                <strong>{profile.favorites[option.id]}</strong>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasWhich && (
        <section className="sh-card sh-card--which">
          <DecorIcon set={profile.decorSet} index={1} className="decor-icon--card-a" />
          <DecorIcon set={profile.decorSet} index={3} className="decor-icon--card-b" />
          <h3><small>どっちが好き？</small><span className="sheet-script">which one?</span></h3>
          <ul className="sh-which">
            {whichQuestions.map((question) => (
              <li key={question.id}>
                <span className="sh-which-q">{question.label}</span>
                {(['a', 'b'] as const).map((side) => (
                  <span key={side} className={`sh-choice${profile.which[question.id] === side ? ' picked' : ''}`}>
                    {question[side]}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasBest && (
        <section className="sh-card sh-card--best">
          <h3><span className="sheet-script">My Best3</span></h3>
          {a.bestTitle && <p className="sh-best-title"><Pill value={a.bestTitle} wide /></p>}
          <ol className="sh-best">
            {[a.best1, a.best2, a.best3].map((value, index) => (
              <li key={index}>
                <b className={`sh-rank sh-rank--${index + 1}`}>{index + 1}</b>
                <span className="sh-best-value">{value}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {moreLines.length > 0 && (
        <section className="sh-card">
          <h3><small>もっと知りたい</small></h3>
          <div className="sh-lines">
            {moreLines.map((line) => (
              <p key={line.label}>{line.label}<Pill value={line.value} wide />{line.tail}</p>
            ))}
          </div>
        </section>
      )}

      {ifItems.length > 0 && (
        <section className="sh-card sh-card--if">
          <h3><span className="sheet-script">If...</span></h3>
          {ifItems.map((item) => (
            <div key={item.q} className="sh-if">
              <small>{item.q}</small>
              <p>{item.v}</p>
            </div>
          ))}
        </section>
      )}

      {(a.oshi || a.oshiStory || a.oshiPoint || a.oshiMsg) && (
        <section className="sh-card sh-card--oshi">
          <h3><small>私の推し</small></h3>
          <div className="sh-lines">
            {a.oshi && <p>私の推しは<Pill value={a.oshi} wide />が好き♡</p>}
            {a.oshiStory && <p>推しとの出会いは<Pill value={a.oshiStory} wide />だよ！</p>}
            {a.oshiPoint && <p>推しのすきなところは<Pill value={a.oshiPoint} wide />だよ♪</p>}
            {a.oshiMsg && <p>推しに伝えたいのは<Pill value={a.oshiMsg} wide />だよ♡</p>}
          </div>
        </section>
      )}

      {a.dream && (
        <section className="sh-card">
          <h3><small>将来のゆめ</small></h3>
          <p className="sh-text">{a.dream}</p>
        </section>
      )}

      <section className="sh-card sh-card--message">
        <h3><small>ひとことメッセージ</small></h3>
        <p className="sh-text">{profile.message}</p>
      </section>

      {profile.freeSpace && (
        <section className="sh-card sh-card--free">
          <h3><span className="sheet-script">Free Space</span></h3>
          <p className="sh-text">{profile.freeSpace}</p>
          <DecorIcon set={profile.decorSet} index={0} className="decor-icon--corner" />
        </section>
      )}

      {(a.from || a.next) && (
        <section className="sh-pass">
          <small>♡ プロフ帳のまわし先 ♡</small>
          <div className="sh-pass-chain">
            <span>{a.from || '？？？'}</span>
            <i aria-hidden="true">➜</i>
            <span className="me">♡わたし♡</span>
            <i aria-hidden="true">➜</i>
            <span>{a.next || '？？？'}</span>
          </div>
        </section>
      )}

      <p className="sh-foot">✿ ぷろぺた ✿</p>
      {overlay}
    </article>
  )
}

function Confetti({ count = 40 }: { count?: number }) {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <i key={index} style={{ '--i': index } as CSSProperties} />
      ))}
    </div>
  )
}

const openedCovers = new Set<string>()

function CoverGate({ profile, coverKey, children }: { profile: Profile; coverKey: string; children: React.ReactNode }) {
  const [state, setState] = useState<'closed' | 'opening' | 'open'>(
    openedCovers.has(coverKey) ? 'open' : 'closed',
  )

  const open = () => {
    if (state !== 'closed') return
    setState('opening')
    window.setTimeout(() => {
      openedCovers.add(coverKey)
      setState('open')
    }, 950)
  }

  if (state === 'open') return <>{children}</>

  return (
    <button
      type="button"
      className={`cover-gate ${bookStyleClasses(profile)}${state === 'opening' ? ' cover-gate--opening' : ''}`}
      onClick={open}
      aria-label="プロフィール帳をひらく"
    >
      <span className="cover-gate-card">
        <span className="cover-gate-spine" aria-hidden="true" />
        <DecorIcon set={profile.decorSet} index={0} className="decor-icon--cover-a" />
        <DecorIcon set={profile.decorSet} index={1} className="decor-icon--cover-b" />
        <DecorIcon set={profile.decorSet} index={2} className="decor-icon--cover-c" />
        <small>PROFILE BOOK</small>
        <strong className="sheet-script">my profile</strong>
        <em>{profile.displayName}</em>
        <span className="cover-gate-hint">タップしてひらく ✦</span>
      </span>
    </button>
  )
}

function PlacedLayer({
  placements,
  stickers,
  editing = false,
  selectedId = null,
  onSelect,
  onMove,
}: {
  placements: Placement[]
  stickers: Sticker[]
  editing?: boolean
  selectedId?: number | null
  onSelect?: (id: number) => void
  onMove?: (id: number, x: number, y: number) => void
}) {
  const layerRef = useRef<HTMLDivElement>(null)
  const dragId = useRef<number | null>(null)

  const handleMove = (event: React.PointerEvent) => {
    if (!editing || dragId.current === null || !layerRef.current) return
    const rect = layerRef.current.getBoundingClientRect()
    onMove?.(
      dragId.current,
      clamp(((event.clientX - rect.left) / rect.width) * 100),
      clamp(((event.clientY - rect.top) / rect.height) * 100),
    )
  }

  return (
    <div
      ref={layerRef}
      className={`placed-layer${editing ? ' placed-layer--edit' : ''}`}
      onPointerMove={handleMove}
      onPointerUp={() => { dragId.current = null }}
      onPointerCancel={() => { dragId.current = null }}
    >
      {placements.map((placement) => {
        const sticker = stickers.find((item) => item.id === placement.stickerId)
        if (!sticker) return null
        return (
          <button
            key={placement.id}
            type="button"
            tabIndex={editing ? 0 : -1}
            aria-label={`${sticker.name}のシール`}
            className={`placed${editing && selectedId === placement.id ? ' placed--selected' : ''}`}
            style={{
              left: `${placement.x}%`,
              top: `${placement.y}%`,
              width: placement.size,
              height: placement.size,
              transform: `translate(-50%, -50%) rotate(${placement.rot}deg)`,
            }}
            onPointerDown={(event) => {
              if (!editing) return
              event.currentTarget.setPointerCapture(event.pointerId)
              dragId.current = placement.id
              onSelect?.(placement.id)
            }}
          >
            <StickerFace symbol={sticker.symbol} />
          </button>
        )
      })}
    </div>
  )
}

function GuestBook({ notes, onAdd }: { notes: GuestNote[]; onAdd?: (note: GuestNote) => void }) {
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [symbol, setSymbol] = useState('pink-heart')
  const [sent, setSent] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onAdd || !text.trim()) return
    onAdd({ id: Date.now(), name: name.trim() || 'ともだち', text: text.trim(), symbol })
    setText('')
    setSent(true)
    window.setTimeout(() => setSent(false), 2600)
  }

  return (
    <section className="guestbook">
      <h2><small>みんなのひとこと</small><span className="sheet-script">messages</span></h2>
      {notes.length > 0 && (
        <ul className="guest-notes">
          {notes.map((note) => (
            <li key={note.id}>
              <StickerFace symbol={note.symbol} />
              <p>{note.text}</p>
              <small>from {note.name}</small>
            </li>
          ))}
        </ul>
      )}
      {onAdd && (
        <form className="guest-form" onSubmit={handleSubmit}>
          <strong>ひとこと書いていってね ✎</strong>
          <input maxLength={10} placeholder="なまえ（ニックネームOK）" value={name} onChange={(event) => setName(event.target.value)} />
          <textarea required rows={2} maxLength={40} placeholder="例：仲良くしてね！" value={text} onChange={(event) => setText(event.target.value)} />
          <div className="guest-symbols" role="group" aria-label="そえるシール">
            {['pink-heart', 'strawberry', 'glowing-star', 'cat-face', 'rainbow', 'cherry-blossom'].map((id) => (
              <button key={id} type="button" className={symbol === id ? 'selected' : ''} aria-pressed={symbol === id} onClick={() => setSymbol(id)}>
                <StickerFace symbol={id} />
              </button>
            ))}
          </div>
          <button className="primary-button" type="submit"><span>ぺたっと書きこむ</span><span aria-hidden="true">✦</span></button>
          {sent && <p className="guest-sent" role="status">書きこんだよ！ありがとう♡</p>}
        </form>
      )}
      {sent && <Confetti count={28} />}
    </section>
  )
}

function ProfilePage({
  profile,
  stickers,
  placements,
  onPlacementsChange,
  notes,
}: {
  profile: Profile
  stickers: Sticker[]
  placements: Placement[]
  onPlacementsChange: (placements: Placement[]) => void
  notes: GuestNote[]
}) {
  const [editing, setEditing] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const selected = placements.find((item) => item.id === selectedId)

  const addSticker = (sticker: Sticker) => {
    let y = 50
    const element = sheetRef.current
    if (element) {
      const rect = element.getBoundingClientRect()
      y = clamp(((window.innerHeight * 0.4 - rect.top) / rect.height) * 100, 6, 94)
    }
    const placement: Placement = {
      id: Date.now(),
      stickerId: sticker.id,
      x: 50 + Math.round(Math.random() * 30 - 15),
      y,
      rot: Math.round(Math.random() * 30 - 15),
      size: 72,
    }
    onPlacementsChange([...placements, placement])
    setSelectedId(placement.id)
  }

  const updateSelected = (patch: Partial<Placement>) => {
    onPlacementsChange(placements.map((item) => (item.id === selectedId ? { ...item, ...patch } : item)))
  }

  const removeSelected = () => {
    onPlacementsChange(placements.filter((item) => item.id !== selectedId))
    setSelectedId(null)
  }

  return (
    <section className={`profile-page page-enter book-theme ${bookStyleClasses(profile)}`}>
      <div className="page-heading">
        <div>
          <p className="eyebrow">PROFILE BOOK</p>
          <h1>{profile.displayName}のプロフィール</h1>
        </div>
        <Link className="mini-action" to="/profile/edit">✎ 編集</Link>
      </div>

      <CoverGate profile={profile} coverKey="mine">
        <button
          type="button"
          className={`paste-toggle${editing ? ' on' : ''}`}
          onClick={() => { setEditing((current) => !current); setSelectedId(null) }}
        >
          {editing ? '✓ 貼りおわり' : '✦ シールを貼る'}
        </button>
        <div ref={sheetRef}>
          <ProfileSheet
            profile={profile}
            overlay={(
              <PlacedLayer
                placements={placements}
                stickers={stickers}
                editing={editing}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onMove={(id, x, y) => onPlacementsChange(placements.map((item) => (item.id === id ? { ...item, x, y } : item)))}
              />
            )}
          />
        </div>

        {editing && (
          <div className="sticker-tray">
            <p>{selected ? 'ドラッグで動かせるよ' : 'シールをタップして貼ろう'}</p>
            <div className="tray-row">
              {stickers.map((sticker) => (
                <button key={sticker.id} type="button" onClick={() => addSticker(sticker)} aria-label={`${sticker.name}を貼る`}>
                  <StickerFace symbol={sticker.symbol} />
                </button>
              ))}
            </div>
            {selected && (
              <div className="tray-tools">
                <button type="button" onClick={() => updateSelected({ size: Math.min(120, selected.size + 10) })}>大きく</button>
                <button type="button" onClick={() => updateSelected({ size: Math.max(36, selected.size - 10) })}>小さく</button>
                <button type="button" onClick={() => updateSelected({ rot: selected.rot + 15 })}>回す ↻</button>
                <button type="button" onClick={removeSelected}>はがす</button>
              </div>
            )}
          </div>
        )}

        <GuestBook notes={notes} />

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
      </CoverGate>
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

  const fillDemo = () => {
    setDraft((current) => ({
      ...current,
      likes: publicProfile.likes,
      activity: publicProfile.activity,
      message: publicProfile.message,
      nickname: publicProfile.nickname,
      birthMonth: publicProfile.birthMonth,
      birthDay: publicProfile.birthDay,
      bloodType: publicProfile.bloodType,
      personality: publicProfile.personality,
      favorites: { ...publicProfile.favorites },
      answers: { ...publicProfile.answers },
      freeSpace: publicProfile.freeSpace,
      which: { ...publicProfile.which },
    }))
  }

  const updateWhich = (key: WhichKey, value: WhichChoice) => {
    setDraft((current) => ({ ...current, which: { ...current.which, [key]: value } }))
  }

  const updateAnswer = (key: AnswerKey, value: string) => {
    setDraft((current) => ({ ...current, answers: { ...current.answers, [key]: value } }))
  }

  const progressChecks = [
    draft.nickname, draft.birthMonth && draft.birthDay, draft.bloodType, draft.personality,
    draft.likes, draft.activity, draft.message, draft.freeSpace,
    ...Object.values(draft.favorites), ...Object.values(draft.answers), ...Object.values(draft.which),
  ]
  const progressDone = progressChecks.filter(Boolean).length
  const progressPercent = Math.round((progressDone / progressChecks.length) * 100)
  const progressMessage =
    progressPercent >= 100 ? 'コンプリート！！ぜんぶ書けたね🎉'
      : progressPercent >= 70 ? 'あとちょっと！ゴールが見えてきた✨'
        : progressPercent >= 40 ? 'もう半分こえた！いい感じ♪'
          : progressPercent >= 10 ? 'いいスタート！すきなものから書こう'
            : 'まずは「すきなもの」から書いてみよう'

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
        <div className="progress-card" role="status">
          <div className="progress-top">
            <strong>できあがり {progressPercent}%</strong>
            <span aria-hidden="true">
              {[25, 50, 75, 100].map((mark) => (
                <i key={mark} className={progressPercent >= mark ? 'got' : ''}>★</i>
              ))}
            </span>
          </div>
          <div className="progress-bar"><span style={{ width: `${progressPercent}%` }} /></div>
          <p>{progressMessage}</p>
        </div>
        {progressPercent >= 100 && <Confetti />}
        <button type="button" className="demo-fill" onClick={fillDemo}>
          ✨ デモの内容で全部うめてみる
        </button>
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
              placeholder="例：ひなた、ひなっち"
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
                  maxLength={14}
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

        {answerGroups.map((group) => (
          <fieldset key={group.id} className="detail-fields">
            <legend>{group.title}</legend>
            {answerQuestions.filter((question) => question.group === group.id).map((question) => (
              <label key={question.id} className="form-field">
                <span>{question.label}</span>
                <input
                  maxLength={24}
                  placeholder={question.placeholder}
                  value={draft.answers[question.id]}
                  onChange={(event) => updateAnswer(question.id, event.target.value)}
                />
              </label>
            ))}
          </fieldset>
        ))}

        <fieldset className="detail-fields">
          <legend>♡ どっちが好き？（タップでえらぶ）</legend>
          {whichQuestions.map((question) => (
            <div key={question.id} className="form-field form-field--row">
              <span>{question.label}</span>
              <div className="chip-options chip-options--wrap">
                {(['a', 'b'] as const).map((side) => (
                  <button
                    key={side}
                    type="button"
                    className={draft.which[question.id] === side ? 'selected' : ''}
                    aria-pressed={draft.which[question.id] === side}
                    onClick={() => updateWhich(question.id, draft.which[question.id] === side ? '' : side)}
                  >
                    {question[side]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </fieldset>

        <fieldset className="detail-fields detail-style">
          <legend>✦ デザインをえらぶ</legend>
          <div className="form-field form-field--row">
            <span>シートの種類</span>
            <div className="chip-options chip-options--wrap">
              {sheetThemeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={draft.sheetTheme === option.id ? 'selected' : ''}
                  aria-pressed={draft.sheetTheme === option.id}
                  onClick={() => updateField('sheetTheme', option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="form-field form-field--row">
            <span>お気に入りのカード</span>
            <div className="chip-options chip-options--wrap">
              {favoriteShapeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={draft.favoriteShape === option.id ? 'selected' : ''}
                  aria-pressed={draft.favoriteShape === option.id}
                  onClick={() => updateField('favoriteShape', option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="form-field form-field--row">
            <span>もじ（フォント）</span>
            <div className="chip-options chip-options--wrap">
              {fontStyleOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={draft.fontStyle === option.id ? 'selected' : ''}
                  style={{ fontFamily: option.family }}
                  aria-pressed={draft.fontStyle === option.id}
                  onClick={() => updateField('fontStyle', option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className="form-field form-field--row">
            <span>デコ（かざり）</span>
            <div className="chip-options chip-options--wrap">
              {(Object.keys(decorSets) as DecorSet[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  className={draft.decorSet === id ? 'selected' : ''}
                  aria-pressed={draft.decorSet === id}
                  onClick={() => updateField('decorSet', id)}
                >
                  {decorSets[id].label}
                </button>
              ))}
            </div>
          </div>
          <p className="form-note">色は上の「プロフィール帳をデザイン」のカラーで変えられるよ</p>
          <div className="details-preview">
            <small>プレビュー（見本の内容で表示しています）</small>
            <ProfileSheet
              isPublic
              profile={{
                ...publicProfile,
                sheetTheme: draft.sheetTheme,
                favoriteShape: draft.favoriteShape,
                fontStyle: draft.fontStyle,
                decorSet: draft.decorSet,
                bookColor: draft.bookColor,
              }}
            />
          </div>
        </fieldset>

        <button className="save-button" type="submit">
          <span>書いた内容を保存</span>
          <span aria-hidden="true">✓</span>
        </button>
        <p className="form-note">このブラウザに保存されるよ。別の端末にはまだ引き継がれない</p>
      </form>
    </section>
  )
}

function StickerFace({ symbol }: { symbol: string }) {
  const known = decorFiles.includes(symbol) ? symbol : 'glowing-star'
  return <img className="sticker-face" src={`${import.meta.env.BASE_URL}decor/${known}.svg`} alt="" />
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
        <StickerFace symbol={sticker.symbol} />
      </span>
      <strong>{sticker.name}</strong>
      <small>{sticker.from ? `${sticker.from}さんから` : sticker.type}</small>
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
              <StickerFace symbol={selectedSticker.symbol} />
            </span>
            <p>{selectedSticker.from ? `${selectedSticker.from}さんから` : selectedSticker.type}</p>
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
  const [selectedType, setSelectedType] = useState<StickerType>('どうぶつ')
  const [selectedDesignId, setSelectedDesignId] = useState(stickerDesigns[0].id)
  const [name, setName] = useState('ひなたのいちごシール')
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
            <StickerFace symbol={selectedDesign.symbol} />
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
                {type}
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
                  <StickerFace symbol={design.symbol} />
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

function PublicProfilePage({
  hasReceived,
  notes,
  onAddNote,
}: {
  hasReceived: boolean
  notes: GuestNote[]
  onAddNote: (note: GuestNote) => void
}) {
  return (
    <section className={`public-profile-page page-enter book-theme ${bookStyleClasses(publicProfile)}`}>
      <div className="visitor-ribbon">
        <span aria-hidden="true">✦</span>
        公開プロフィール
      </div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">HINATA&apos;S PROFILE BOOK</p>
          <h1>{publicProfile.displayName}のぷろぺた</h1>
        </div>
        <span className="page-number">♡</span>
      </div>

      <CoverGate profile={publicProfile} coverKey="public">
        <ProfileSheet
          profile={publicProfile}
          isPublic
          overlay={<PlacedLayer placements={demoPlacements} stickers={defaultStickers} />}
        />
        <GuestBook notes={notes} onAdd={onAddNote} />

      <section className="public-sticker-offer">
        <div>
          <p className="eyebrow">PRESENT STICKER</p>
          <h2>配布中のシール</h2>
        </div>
        <span className={`sticker-art sticker-art--offer ${publicSticker.className}`}>
          <StickerFace symbol={publicSticker.symbol} />
        </span>
        <strong>{publicSticker.name}</strong>
        <p>{publicSticker.message}</p>
      </section>

      <Link className="receive-button" to="/p/hinata/receive">
        <span aria-hidden="true">{hasReceived ? '✓' : '✦'}</span>
        <span>{hasReceived ? '受け取り状況を見る' : 'このシールを受け取る'}</span>
        <span aria-hidden="true">›</span>
      </Link>
      <p className="page-hint">ログインなしで体験できるデモページです</p>
      </CoverGate>
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
      navigate('/p/hinata/received', { state: { duplicate: true } })
      return
    }

    onReceive(publicSticker)
    navigate('/p/hinata/received', { state: { duplicate: false } })
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
            <StickerFace symbol={publicSticker.symbol} />
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
      <p className="destination-note">受け取り先：ひなたのシール帳</p>
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
            <StickerFace symbol={publicSticker.symbol} />
          </span>
          <span className="paste-spark spark-one">✦</span>
          <span className="paste-spark spark-two">♡</span>
          <span className="paste-spark spark-three">★</span>
        </div>
      </div>

      {!isDuplicate && <Confetti />}
      <div className="received-message" role="status">
        <span className="received-icon">{isDuplicate ? '✓' : '✿'}</span>
        <p className="eyebrow">{isDuplicate ? 'ALREADY IN YOUR ALBUM' : 'STICKER RECEIVED!'}</p>
        <h1>{isDuplicate ? 'このシールはもう持っているよ' : 'シールをぺたっと貼ったよ！'}</h1>
        <p>
          {isDuplicate
            ? 'シール帳にある1枚をそのまま大切にしよう'
            : `${publicProfile.displayName}さんのシールが、ひなたのシール帳に追加されました`}
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
      answers: { ...emptyAnswers, ...saved.answers },
      which: { ...emptyWhich, ...saved.which },
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
  const [receivedStickers, setReceivedStickers] = usePersistentState<Sticker[]>('puropera:received:v1', [])
  const [placements, setPlacements] = usePersistentState<Placement[]>('puropera:placed:v1', demoPlacements)
  const [notes, setNotes] = usePersistentState<GuestNote[]>('puropera:guest:v1', seedGuestNotes)
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
        <Route
          path="/profile"
          element={(
            <ProfilePage
              profile={profile}
              stickers={stickers}
              placements={placements}
              onPlacementsChange={setPlacements}
              notes={notes}
            />
          )}
        />
        <Route
          path="/profile/edit"
          element={<EditProfilePage profile={profile} onSave={setProfile} />}
        />
        <Route
          path="/stickers"
          element={(
            <StickersPage
              stickers={stickers}
              ownerName={profile.nickname || profile.displayName.replace(/\s/g, '') || 'ひなた'}
            />
          )}
        />
        <Route
          path="/stickers/create"
          element={<CreateStickerPage onSave={setMySticker} />}
        />
        <Route path="/p/shii" element={<Navigate to="/p/hinata" replace />} />
        <Route path="/p/shii/receive" element={<Navigate to="/p/hinata/receive" replace />} />
        <Route path="/p/shii/received" element={<Navigate to="/p/hinata/received" replace />} />
        <Route path="/p/mio" element={<Navigate to="/p/hinata" replace />} />
        <Route path="/p/mio/receive" element={<Navigate to="/p/hinata/receive" replace />} />
        <Route path="/p/mio/received" element={<Navigate to="/p/hinata/received" replace />} />
        <Route
          path="/p/hinata"
          element={(
            <PublicProfilePage
              hasReceived={hasReceivedPublicSticker}
              notes={notes}
              onAddNote={(note) => setNotes((current) => [note, ...current])}
            />
          )}
        />
        <Route
          path="/p/hinata/receive"
          element={(
            <ReceiveStickerPage
              hasReceived={hasReceivedPublicSticker}
              onReceive={receiveSticker}
            />
          )}
        />
        <Route
          path="/p/hinata/received"
          element={<ReceivedStickerPage hasReceived={hasReceivedPublicSticker} />}
        />
        <Route path="*" element={<HomePage profile={profile} stickerCount={stickers.length} />} />
      </Routes>
    </AppShell>
  )
}

export default App
