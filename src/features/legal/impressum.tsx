import type { FC } from 'react'
import { Link, Typography } from '@mui/material'
import LegalPageLayout from './legal-page-layout'

const EXTERNAL_SYSTEMS: { name: string; detail: string; href?: string }[] = [
  {
    name: 'Sotra',
    detail:
      'Übersetzungsdienst, bereitgestellt vom Rěčne centrum WITAJ / Domowina – Zwjazk Łužiskich Serbow z. t.',
    href: 'https://sotra.app',
  },
  {
    name: 'Witaj Sprachzentrum',
    detail: 'Anbieter des Sotra-Übersetzungsprogramms',
    href: 'https://www.witaj-sprachzentrum.de/',
  },
  {
    name: 'Bamborak',
    detail: 'TTS & STT – Korla Baier',
    href: 'https://bamborak.de',
  },
  {
    name: 'Whisper (Korla)',
    detail: 'Spracherkennung – Modelle von Korla Baier auf Hugging Face',
    href: 'https://hf.co/Korla',
  },
  {
    name: 'Mudrowak TTS',
    detail: 'Text-to-Speech – Daniel Zoba',
    href: 'https://bamborak.mudrowak.de',
  },
  {
    name: 'Webcaptioner STT',
    detail: 'Speech-to-Text – Daniel Zoba',
    href: 'https://spoznawanje.serbski-inkubator.de',
  },
  {
    name: 'ChatGPT / OpenAI',
    detail: 'Sprach- und Übersetzungsunterstützung',
    href: 'https://openai.com/de-DE/index/chatgpt',
  },
  {
    name: 'LibreTranslate',
    detail: 'Übersetzungsmodell (u. a. Zielsprachen Englisch, Polnisch)',
  },
  {
    name: 'Keycloak',
    detail: 'Authentifizierung und Identitätsverwaltung',
  },
  {
    name: 'Sotra-Modelle ctranslate und fairseq (lmu_fairseq)',
    detail: 'Übersetzungsmodelle, die über Sotra in Webcaptioner auswählbar sind',
  },
]

const OPEN_SOURCE_SOURCES: { name: string; href: string }[] = [
  { name: 'Whisper (GitHub)', href: 'https://github.com/openai/whisper' },
  {
    name: 'Whisper.cpp (GitHub)',
    href: 'https://github.com/ggerganov/whisper.cpp',
  },
  {
    name: 'Fairseq (GitHub)',
    href: 'http://github.com/facebookresearch/fairseq',
  },
  {
    name: 'Žórła aplikacije (GitHub)',
    href: 'https://github.com/ZalozbaDev/uploader-recny-model/',
  },
  {
    name: 'Žórła servera (GitHub)',
    href: 'https://github.com/ZalozbaDev/uploader-recny-model-server/',
  },
]

const ImpressumPage: FC = () => {
  return (
    <LegalPageLayout title='Impressum'>
      <Typography component='h2'>Anbieter</Typography>
      <Typography component='p'>
        <strong>Stiftung für das sorbische Volk</strong>
        <br />
        Załožba za serbski lud
        <br />
        Postplatz 2, 02625 Bautzen
        <br />
        Telefon: 03591 550 300
        <br />
        E-Mail:{' '}
        <Link href='mailto:sekretariat@zalozba.de'>sekretariat@zalozba.de</Link>
        ;{' '}
        <Link href='mailto:chosebuz@zalozba.de'>chosebuz@zalozba.de</Link>
        <br />
        Internet:{' '}
        <Link href='https://zalozba.de' target='_blank' rel='noopener noreferrer'>
          zalozba.de
        </Link>
        <br />
        USt-IdNr.: DE182953890
      </Typography>

      <Typography component='p'>
        Die Webanwendung <strong>Serbski Webcaptioner</strong> ist ein Angebot
        der Stiftung für das sorbische Volk.
      </Typography>

      <Typography component='h2'>Rechtsform und Vertretung</Typography>
      <Typography component='p'>
        Die Stiftung für das sorbische Volk ist eine Stiftung des öffentlichen
        Rechts gemäß Artikel 1 des Staatsvertrages zwischen dem Land Brandenburg
        und dem Freistaat Sachsen über die Errichtung der „Stiftung für das
        sorbische Volk“ vom 28.08.1998. Sitz der Stiftung ist Bautzen. Sie trägt
        die sorbische Bezeichnung Załožba za serbski lud.
      </Typography>
      <Typography component='p'>
        Die Stiftung für das sorbische Volk wird gerichtlich und außergerichtlich
        vertreten durch den Direktor. Er ist auch inhaltlich verantwortlich gem.
        § 18 Abs. 2 MStV.
      </Typography>

      <Typography component='h2'>Haftungsausschluss</Typography>
      <Typography component='h3'>Inhalt</Typography>
      <Typography component='p'>
        Die Stiftung ist um Richtigkeit und Aktualität der in dieser Anwendung
        bereitgestellten Informationen bemüht. Dennoch können Fehler und
        Unklarheiten nicht vollständig ausgeschlossen werden. Die Stiftung
        übernimmt deshalb keine Gewähr für die Aktualität, Richtigkeit,
        Vollständigkeit oder Qualität der bereitgestellten Informationen. Für
        Schäden materieller oder immaterieller Art, die durch die Nutzung oder
        Nichtnutzung der dargebotenen Informationen bzw. durch die Nutzung
        fehlerhafter und unvollständiger Informationen unmittelbar oder
        mittelbar verursacht werden, haftet die Stiftung nicht, sofern ihr nicht
        nachweislich vorsätzliches oder grob fahrlässiges Verschulden zur Last
        fällt.
      </Typography>

      <Typography component='h3'>Links</Typography>
      <Typography component='p'>
        Sofern auf Verweisziele („Links“) direkt oder indirekt verwiesen wird,
        die außerhalb des Verantwortungsbereiches der Stiftung liegen, haftet
        diese nur dann, wenn sie von den Inhalten Kenntnis hat und es ihr
        technisch möglich und zumutbar wäre, die Nutzung im Falle rechtswidriger
        Inhalte zu verhindern. Für darüber hinausgehende Inhalte und
        insbesondere für Schäden, die aus der Nutzung oder Nichtnutzung
        solcherart dargebotener Informationen entstehen, haftet allein der
        Anbieter der Seite, auf welche verwiesen wurde, nicht derjenige, der
        über Links auf die jeweilige Veröffentlichung lediglich verweist.
      </Typography>

      <Typography component='h3'>Mehrsprachigkeit der Inhalte</Typography>
      <Typography component='p'>
        Diese Anwendung kann Inhalte in deutscher, obersorbischer und
        niedersorbischer Sprache anzeigen. Wir bitten um Verständnis, dass die
        vollständige Übersetzung aller Inhalte nicht immer und aktuell
        gewährleistet werden kann.
      </Typography>

      <Typography component='h3'>Urheberrecht</Typography>
      <Typography component='p'>
        Das Copyright für veröffentlichte, von der Stiftung selbst erstellte
        Objekte bleibt allein beim Autor. Eine Vervielfältigung oder Verwendung
        solcher Grafiken, Tondokumente, Videosequenzen und Texte in anderen
        elektronischen oder gedruckten Publikationen ist ohne ausdrückliche
        Zustimmung des Autors nicht gestattet.
      </Typography>

      <Typography component='h3'>Rechtswirksamkeit</Typography>
      <Typography component='p'>
        Sofern Teile oder einzelne Formulierungen dieses Textes der geltenden
        Rechtslage nicht, nicht mehr oder nicht vollständig entsprechen
        sollten, bleiben die übrigen Teile des Dokumentes in ihrem Inhalt und
        ihrer Gültigkeit unberührt.
      </Typography>

      <Typography component='h2'>Externe Systeme und Dienste</Typography>
      <Typography component='p'>
        Für Spracherkennung, Übersetzung, Sprachsynthese und Authentifizierung
        werden u. a. folgende externe Programme und Systeme eingesetzt:
      </Typography>
      <ul>
        {EXTERNAL_SYSTEMS.map(item => (
          <li key={item.name}>
            <strong>{item.name}</strong>
            {item.href ? (
              <>
                {' '}
                —{' '}
                <Link href={item.href} target='_blank' rel='noopener noreferrer'>
                  {item.href.replace(/^https?:\/\//, '')}
                </Link>
              </>
            ) : null}
            <br />
            {item.detail}
          </li>
        ))}
      </ul>

      <Typography component='h2'>Quellen und Open-Source-Modelle</Typography>
      <Typography component='p'>
        Für die genutzten Sprach- und Übersetzungsmodelle werden u. a. folgende
        Quellen verwendet bzw. referenziert:
      </Typography>
      <ul>
        {OPEN_SOURCE_SOURCES.map(item => (
          <li key={item.href}>
            <Link href={item.href} target='_blank' rel='noopener noreferrer'>
              {item.name}
            </Link>
          </li>
        ))}
        <li>
          Preložowanski program Sotra, poskićeny wot Rěčneho centruma WITAJ,
          Domowina – Zwjazk Łužiskich Serbow z. t. —{' '}
          <Link
            href='https://www.witaj-sprachzentrum.de/'
            target='_blank'
            rel='noopener noreferrer'
          >
            witaj-sprachzentrum.de
          </Link>
        </li>
      </ul>

      <Typography component='p' sx={{ mt: 3, opacity: 0.8 }}>
        © Stiftung für das sorbische Volk / Załožba za serbski lud. Alle Rechte
        vorbehalten.
      </Typography>
    </LegalPageLayout>
  )
}

export default ImpressumPage
