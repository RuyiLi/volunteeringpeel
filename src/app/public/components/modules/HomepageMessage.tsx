import * as React from 'react';
import { Button, Container, Header, Message } from 'semantic-ui-react';

// App Imports
import VPExecsApp2018Docx from '@app/downloads/VPExecsApp2018.docx';

// PUT ANY MESSAGE BOX THAT YOU WANT TO EXPORT HERE. DO NOT DELETE THE EXAMPLE ONE
// tslint:disable-next-line:variable-name
const HomepageMessage: React.ComponentType = () => {
  // EXAMPLE MESSAGE BOX.
  // return (
  //   <Container style={{ paddingTop: '1em' }}>
  //     <Message>
  //       <Header as="h3">Site Redesign!</Header>
  //       <p>
  //         As you can see, the site has been redesigned! The site may still have bugs, so please bear
  //         with us as we transition everything over. Just a few things you should know:
  //         <ul>
  //           <li>
  //             You now must create an account to sign up for events. We chose to do this because it
  //             will be easier for us to organize information like contact information and attendance.
  //           </li>
  //           <li>
  //             We have updated our Terms and Conditions and Privacy Policy to better reflect how we
  //             use your data. You can find it on the <Link to="/about/legal">legal</Link> page.
  //           </li>
  //           <li>
  //             If you do encounter any bugs or errors, take a screenshot and send it to{' '}
  //             <a href="mailto:james.ahyong@gmail.com">james.ahyong@gmail.com</a>. Include details on
  //             when/how you encountered the error. We'll try and get it fixed as soon as we can.
  //           </li>
  //         </ul>
  //         If you have any feedback whatsoever really,{' '}
  //         <a href="mailto:james.ahyong@gmail.com">shoot me an email</a>, and we'll see what we can
  //         do.
  //       </p>
  //       <p>
  //         <em>~~james, the guy who made the site</em>
  //       </p>
  //     </Message>
  //   </Container>
  // );

  // Exec Apps
  // return (
  //   <Container style={{ paddingTop: '1em' }}>
  //     <Message>
  //       <Header as="h3">Apply to be part of the exec team!</Header>
  //       <p>
  //         Volunteering Peel Committee Member applications are out now! If you're a grade 9 or 10
  //         student who enjoys volunteering and leading volunteers, meeting new people and getting
  //         involved, then apply for the Volunteering Peel Executive team. Applications are due on
  //         October 27th!
  //       </p>
  //       <a href={VPExecsApp2018Docx}>
  //         <Button primary>Apply Now</Button>
  //       </a>
  //     </Message>
  //   </Container>
  // );

  return (
    <Container style={{ paddingTop: '1em' }}>
      <Message>
        <Header as="h3">We are currently experiencing some login issues</Header>
        <p>
          Currently, the auth0 option to send a confirmation code is not working. However, you can still log in or create an account via your Google or Facebook account by clicking "Login" then clicking one of the two buttons at the top.
        </p>
        <br/>
        <p>
          If you have neither a Google account (you can use your pdsb email) or Facebook, please email us at <a href="mailto:info@volunteeringpeel.org">info@volunteeringpeel.org</a> regarding the event(s) you wish to sign up for. Again, sorry for the inconvenience and we are doing our best to fix it as soon as possible.
        </p>
      </Message>
    </Container>
  );
};

export default HomepageMessage;
