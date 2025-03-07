/* eslint-disable react/no-unescaped-entities */
import * as React from 'react'

import { Markdown } from '@/components/markdown'

import styles from './styles.module.css'

const lastUpdatedDate = 'March 7, 2025'

export default async function Page() {
  return (
    <>
      <section className={styles.page}>
        <div className={styles.meta}>
          <h1 className={styles.title}>Legal</h1>
        </div>

        <Markdown className={styles.markdown}>
          <h2>Privacy Policy</h2>

          <p>Last updated: {lastUpdatedDate}</p>

          <p>
            This Privacy Policy describes how Severance Wellness Memes ("we",
            "us", or "our") collects, uses, and shares information when you use
            our website (the "Service").
          </p>

          <p>
            <strong>Information We Collect</strong>
          </p>

          <p>
            When you use our Service, we may collect the following types of
            information:
          </p>

          <ul>
            <li>
              <strong>Public Twitter Profile Data</strong>: When you opt-in, we
              access your public Twitter profile information and recent public
              tweets. This includes your username, display name, profile
              picture, and public tweet content.
            </li>

            <li>
              <strong>Usage Data</strong>: We may collect anonymous usage data
              such as pages visited and features used.
            </li>
          </ul>

          <p>
            <strong>How We Use Information</strong>
          </p>

          <p>We use the information we collect to:</p>

          <ul>
            <li>
              Generate personalized Severance-themed wellness memes based on
              your public Twitter content
            </li>

            <li>Improve and optimize our Service</li>

            <li>Process payments through Stripe</li>
          </ul>

          <p>
            <strong>Data Storage</strong>
          </p>

          <p>
            We do not store any private data from your Twitter account. We only
            process public information that you explicitly opt-in to share with
            our Service. Our application does not support any authentication.
          </p>

          <p>
            <strong>Third-Party Services</strong>
          </p>

          <p>Our Service uses the following third-party services:</p>

          <ul>
            <li>
              <strong>Stripe</strong>: For processing payments. Please refer to
              Stripe's privacy policy for information on how they handle your
              payment data.
            </li>

            <li>
              <strong>Twitter/X</strong>: To access public profile information
              that you explicitly share with us.
            </li>
          </ul>

          <p>
            <strong>Contact Us</strong>
          </p>

          <p>
            If you have any questions about this Privacy Policy, please contact
            us at <a href='https://x.com/transitive_bs'>@transitive_bs</a>.
          </p>

          <h2>Terms of Service</h2>

          <p>Last updated: {lastUpdatedDate}</p>

          <p>
            Please read these Terms of Service ("Terms") carefully before using
            the Severance Wellness Memes website (the "Service") operated by
            Agentic ("we", "us", or "our").
          </p>

          <p>
            <strong>Acceptance of Terms</strong>
          </p>

          <p>
            By accessing or using the Service, you agree to be bound by these
            Terms. If you disagree with any part of the terms, you may not
            access the Service.
          </p>

          <p>
            <strong>Description of Service</strong>
          </p>

          <p>
            This website is not affiliated with, endored by, or connected to
            Apple, Severance, Lumon, Endeavor Content, Red Hour Productions,
            Fifth Season, or anything else remotely official. It is a fan-made
            website that generates Severance-themed wellness memes based on your
            public Twitter profile.
          </p>

          <p>
            <strong>Intellectual Property</strong>
          </p>

          <p>
            This Service is created by Travis Fischer under Agentic. The Service
            contains content that may include text, graphics, images, and other
            materials created by us or obtained from third parties. All content
            on the Service is protected by copyright, trademark, and other
            intellectual property laws.
          </p>

          <p>
            <strong>User Content</strong>
          </p>

          <p>
            When you provide your Twitter username to our Service, you grant us
            permission to access and use your public Twitter profile and tweets
            for the purpose of generating personalized memes. You represent and
            warrant that you have the right to grant such permission.
          </p>

          <p>
            <strong>Payments</strong>
          </p>

          <p>
            All payments are processed through Stripe. We do not store your
            payment information. All purchases are final and non-refundable
            unless required by law.
          </p>

          <p>
            <strong>Disclaimer</strong>
          </p>

          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
            WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT
            THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE.
          </p>

          <p>
            <strong>Limitation of Liability</strong>
          </p>

          <p>
            IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT
            LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER
            INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR
            INABILITY TO ACCESS OR USE THE SERVICE.
          </p>

          <p>
            <strong>Changes to Terms</strong>
          </p>

          <p>
            We reserve the right to modify or replace these Terms at any time.
            It is your responsibility to review these Terms periodically for
            changes.
          </p>

          <p>
            <strong>Contact Us</strong>
          </p>

          <p>
            If you have any questions about these Terms, please contact us at{' '}
            <a href='https://x.com/transitive_bs'>@transitive_bs</a>.
          </p>
        </Markdown>
      </section>
    </>
  )
}
