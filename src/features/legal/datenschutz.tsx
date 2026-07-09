import type { FC } from 'react'
import { Link, Typography } from '@mui/material'
import LegalPageLayout from './legal-page-layout'

const DatenschutzPage: FC = () => {
  return (
    <LegalPageLayout title='Datenschutz'>
      <Typography component='p'>
        Die Webanwendung <strong>Serbski Webcaptioner</strong> wird von der
        Stiftung für das sorbische Volk betrieben. Die Stiftung erhebt und nutzt
        personenbezogene Daten ausschließlich in Übereinstimmung mit dem
        jeweils geltenden Datenschutzrecht. Nachfolgend erläutern wir, wie Ihre
        Daten in dieser Anwendung verarbeitet werden.
      </Typography>

      <Typography component='h2'>Verantwortlicher</Typography>
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
      </Typography>

      <Typography component='h2'>Verarbeitete Daten</Typography>
      <Typography component='p'>
        Je nach Nutzungsart können insbesondere folgende Daten verarbeitet
        werden:
      </Typography>
      <ul>
        <li>
          <strong>Account-Login:</strong> E-Mail-Adresse, Vor- und Nachname,
          Rolle sowie Authentifizierungs- und Aktualisierungstoken
        </li>
        <li>
          <strong>Globales Passwort:</strong> Zugang ohne persönliche
          Stammdaten; es wird lediglich ein Sitzungsmerkmal zur Anmeldung
          gespeichert
        </li>
        <li>
          <strong>Lokale Speicherung (Browser):</strong> Auth-Token bzw.
          Anmeldekennzeichen, Theme-Einstellungen sowie Einstellungen der
          Cast-Ansicht (z. B. Schriftgröße, Autoscroll, Audio)
        </li>
        <li>
          <strong>Nutzungsinhalte:</strong> Audiodaten der Aufnahme,
          Transkripte, Übersetzungen sowie zugehörige Sitzungs- und
          Verlaufsdaten (AudioRecords) bei Account-Nutzung
        </li>
        <li>
          <strong>Technische Zugriffsdaten:</strong> übliche Server-Protokolldaten
          (z. B. Zeitpunkte und technische Verbindungsinformationen), soweit für
          den Betrieb erforderlich
        </li>
      </ul>

      <Typography component='h2'>Zweck und Rechtsgrundlage</Typography>
      <Typography component='p'>
        Die Verarbeitung erfolgt zum Betrieb der Anwendung, insbesondere für
        Authentifizierung, Spracherkennung (STT), Übersetzung, Sprachsynthese
        (TTS), Speicherung von Aufzeichnungsverläufen sowie Darstellung der
        Untertitel/Cast-Ansicht.
      </Typography>
      <Typography component='p'>
        Rechtsgrundlagen sind je nach Vorgang Art. 6 Abs. 1 lit. b DSGVO
        (Vertrag bzw. vorvertragliche Maßnahmen / Nutzung des Dienstes), Art. 6
        Abs. 1 lit. f DSGVO (berechtigtes Interesse am sicheren und
        funktionsfähigen Betrieb) sowie – soweit erforderlich – Art. 6 Abs. 1
        lit. a DSGVO (Einwilligung).
      </Typography>

      <Typography component='h2'>
        Empfänger und eingesetzte Systeme
      </Typography>
      <Typography component='p'>
        Zur Erbringung der Funktionen können Audio- und Textdaten an folgende
        Systeme bzw. Dienste übermittelt und dort verarbeitet werden:
      </Typography>
      <ul>
        <li>
          Eigener Webcaptioner-Server (Backend der Anwendung)
        </li>
        <li>
          Sotra / Witaj Sprachzentrum —{' '}
          <Link href='https://sotra.app' target='_blank' rel='noopener noreferrer'>
            sotra.app
          </Link>
          {' / '}
          <Link
            href='https://www.witaj-sprachzentrum.de/'
            target='_blank'
            rel='noopener noreferrer'
          >
            witaj-sprachzentrum.de
          </Link>{' '}
          (Übersetzung; Modelle u. a. ctranslate, fairseq, LibreTranslate)
        </li>
        <li>
          Bamborak —{' '}
          <Link href='https://bamborak.de' target='_blank' rel='noopener noreferrer'>
            bamborak.de
          </Link>{' '}
          (TTS & STT, Korla Baier)
        </li>
        <li>
          Whisper-Modelle von Korla —{' '}
          <Link href='https://hf.co/Korla' target='_blank' rel='noopener noreferrer'>
            hf.co/Korla
          </Link>{' '}
          (Spracherkennung)
        </li>
        <li>
          Mudrowak TTS —{' '}
          <Link
            href='https://bamborak.mudrowak.de'
            target='_blank'
            rel='noopener noreferrer'
          >
            bamborak.mudrowak.de
          </Link>{' '}
          (Daniel Zoba)
        </li>
        <li>
          Webcaptioner STT —{' '}
          <Link
            href='https://spoznawanje.serbski-inkubator.de'
            target='_blank'
            rel='noopener noreferrer'
          >
            spoznawanje.serbski-inkubator.de
          </Link>{' '}
          (Daniel Zoba)
        </li>
        <li>
          LibreTranslate (Übersetzung)
        </li>
        <li>
          ChatGPT / OpenAI —{' '}
          <Link
            href='https://openai.com/de-DE/index/chatgpt'
            target='_blank'
            rel='noopener noreferrer'
          >
            openai.com
          </Link>
        </li>
        <li>Keycloak (Authentifizierung)</li>
      </ul>
      <Typography component='p'>
        Soweit Auftragsverarbeiter eingesetzt werden, erfolgt die Verarbeitung
        auf Grundlage entsprechender Vereinbarungen und nur zu den genannten
        Zwecken. Eine Weitergabe an Dritte zu anderen Zwecken findet nicht
        statt, es sei denn, dies ist gesetzlich vorgeschrieben.
      </Typography>

      <Typography component='h2'>Speicherung und Löschung</Typography>
      <Typography component='p'>
        Auth-Token und lokale Einstellungen werden im Browser gespeichert und
        können durch Abmelden bzw. Löschen der Browserdaten entfernt werden.
        Aufzeichnungs- und Verlaufsdaten eingeloggter Accounts werden auf dem
        Server gespeichert, bis sie von der nutzenden Person gelöscht werden
        oder eine Löschung auf Anfrage erfolgt. Protokolldaten werden nur so
        lange aufbewahrt, wie es für Betrieb, Sicherheit und etwaige
        Rechtsansprüche erforderlich ist.
      </Typography>

      <Typography component='h2'>Cookies und lokale Speicherung</Typography>
      <Typography component='p'>
        Es wird kein separates Tracking- oder Analyse-Tool (z. B. Matomo)
        eingesetzt. Die Anwendung nutzt notwendige Speicherung im Browser
        (localStorage), insbesondere für Anmeldung und nutzerbezogene
        Darstellungseinstellungen. Ohne diese Speicherung ist die Nutzung der
        Anwendung in der vorgesehenen Form nicht möglich.
      </Typography>

      <Typography component='h2'>Rechte der Betroffenen</Typography>
      <Typography component='p'>
        Sie haben nach Maßgabe der DSGVO insbesondere das Recht auf Auskunft,
        Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit
        sowie Widerspruch gegen Verarbeitungen, die auf berechtigtem Interesse
        beruhen. Soweit eine Verarbeitung auf Einwilligung beruht, können Sie
        diese jederzeit mit Wirkung für die Zukunft widerrufen.
      </Typography>
      <Typography component='p'>
        Zur Ausübung Ihrer Rechte wenden Sie sich bitte an{' '}
        <Link href='mailto:sekretariat@zalozba.de'>sekretariat@zalozba.de</Link>.
        Außerdem besteht ein Beschwerderecht bei einer zuständigen
        Datenschutzaufsichtsbehörde.
      </Typography>

      <Typography component='p' sx={{ mt: 3, opacity: 0.8 }}>
        Stand: Juli 2026. Diese Datenschutzerklärung kann bei Änderungen der
        Anwendung oder der Rechtslage angepasst werden.
      </Typography>
    </LegalPageLayout>
  )
}

export default DatenschutzPage
