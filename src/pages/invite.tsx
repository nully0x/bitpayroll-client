import {
  Button,
  Center,
  Container,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import endpoints from "../api/endpoints";
import { storageService } from "../auth/storageService";
import AuthStatus from "../components/AuthStatus";
import { DataState } from "../types";
import * as Yup from "yup";
import { Field, FieldProps, Form, Formik } from "formik";
import axios from "../api/axios";
import customToast from "../components/toasts";

const Invite = () => {
  const token = useParams().inviteCode;

  const toast = useToast()

  const [invitation, setInvitation] = useState<DataState<{}>>({
    loading: false,
    data: null,
    error: {
      state: false,
      errMessage: "",
    },
  });

  const madeRequest = useRef(false);

  type EmployeeInviteValues = {
    firstName: string,
    lastName: string,
    walletAddress: string,
  }

  const initialValues = {
    firstName: "",
    lastName: "",
    walletAddress: "",
  };

  const InviteEmployeeSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    lastName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    walletAddress: Yup.string()
      .min(16, "Address is too short")
      .required("Required"),
  });

  const sendInvite = (values: EmployeeInviteValues) => {
    if (madeRequest.current) return;
    const body = {
        firstName: values.firstName,
        lastName: values.lastName,
        wallet_address: values.walletAddress,
    }
    
    if (token) {
      setInvitation(prev => ({...prev, loading: true}))
      storageService.removeData();
      axios
        .put(endpoints.CREATE_EMPLOYEE_WITH_INVITE(token), body)
        .then((res) => {
          madeRequest.current = true;
          setInvitation((prev) => ({
            ...prev,
            data: res.data,
            loading: false,
          }));
        })
        .catch((err) => {
          let errMessage =
            err?.response?.data?.message || "Something went wrong";
            toast({
              title: "Unsuccessfull",
              status: "error",
              description: errMessage,
              isClosable: true,
            })
          setInvitation({
            data: null,
            loading: false,
            error: { state: true, errMessage },
          });
        });
    }
  };

  if (!token) {
    return (
      <Center w="full" h="100vh">
        Not found
      </Center>
    );
  }

  if (!invitation.error.state && !invitation.loading && invitation.data) {
    return (
      <AuthStatus isError={false} 
      text="Invite accepted. You can login or create an account to view your organisations" 
      link="/login"
      linkText="Login"
      />
    )
  }

  return (
    <Center w="full" h="100vh">
      <Container
        maxW="438px"
        textAlign="center"
        p={12}
        fontSize="sm"
        border="0.5px solid"
        borderColor="grey.100"
        borderRadius="10px"
      >
        <Heading fontWeight="500" fontSize="2xl" color="grey.375">
          Invitation
        </Heading>
        <Text fontWeight="500" color="grey.200" mt="4">
          Enter your details to continue
        </Text>
        <Formik
          initialValues={initialValues}
          validationSchema={InviteEmployeeSchema}
          onSubmit={sendInvite}
        >
          {(props) => (
            <Form>
              <Stack spacing={6} mt="56px" mb="50px">
                <Field name="firstName">
                  {(props: FieldProps) => (
                    <FormControl
                      isInvalid={
                        props.form.errors.firstName &&
                        props.form.touched.firstName
                          ? true
                          : false
                      }
                    >
                      <Input
                        {...props.field}
                        placeholder="First name"
                        type="text"
                      />
                      <FormErrorMessage>{`${props.form.errors?.firstName}`}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="lastName">
                  {(props: FieldProps) => (
                    <FormControl
                      isInvalid={
                        props.form.errors.lastName &&
                        props.form.touched.lastName
                          ? true
                          : false
                      }
                    >
                      <Input
                        {...props.field}
                        placeholder="Last name"
                        type="text"
                      />
                      <FormErrorMessage>{`${props.form.errors?.lastName}`}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="walletAddress">
                  {(props: FieldProps) => (
                    <FormControl
                      isInvalid={
                        props.form.errors.walletAddress &&
                        props.form.touched.walletAddress
                          ? true
                          : false
                      }
                    >
                      <Input
                        {...props.field}
                        placeholder="Wallet Address"
                        type="text"
                      />
                      <FormErrorMessage>{`${props.form.errors?.walletAddress}`}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
              </Stack>
              <Button isLoading={invitation.loading} type="submit">
                Accept Invite
              </Button>
            </Form>
          )}
        </Formik>
      </Container>
    </Center>
  );
};

export default Invite;
