import * as _ from 'underscore';

interface Car {
    make: string;
}

interface Dog {
    breed: string;
}

function type_declaration_and_assertion() {
    // The best way to declare a variable is of a type is to use type declaration.
    // Type declaration is when you append the colon and the type after the variable
    // like below.
    // When you do this Typescript marks that variable as being of the type and
    // will not allow you to assign a value of a different type to it.
    let car: Car = {
        make: 'Toyota'
    };

    // The following line will cause a compile error because the type of car is
    // Car and the object being assigned is missing the make property.
    // car = {};

    // The following line will NOT cause a compiler error however because we are
    // telling the compiler that the object {} is actually of type Car.
    // This is called a type assertion.
    // It is allowed because the {} type is less specific than Car. Meaning it's
    // type allows for having any key and value pair. So we can narrow that type
    // to that of Car without compiler error. Even though the object is actually
    // missing the make property.
    car = {} as Car;
}

function type_assertions() {
    // The type assertion below is taking the object type which is more generic 
    // than Car and asserting that it is of type Car.
    const car = {} as Car;
    car.make = 'Toyota';

    // Type assertions must always specify a more specific type
    // This is why you will see assertions specifying the unkownn type before 
    // asserting a new type
    // let x = car as unknown as Dog;
    // The following line will cause a compiler error because the type Dog is
    // not more or less specific than the Car type. It has completely different 
    // requirements.
    // let y = car as Dog;
}

// It is best to have minimal type assertions and annotations in your code.
function minimal_types() {
    function get_car() {
        let truck: Car = {
            make: 'Toyota'
        };

        return truck;
    }

    // The type assertion below is not needed because the compiler can infer the
    // type of the variable from the return type of the function.
    let car = get_car() as Car;
    // Type declaration is also not necessary
    let truck: Car = get_car();

    // Later if the get_car function changes it's return type to something other
    // than Car we now need to go and change these lines as well

    // It is best to let the compiler infer the type
    let inferred = get_car();

    // Decalre your variable and function types and let the typechecker infer 
    // the type of variables throughout your code without unecessary type
    // assertions and declarations.

    // Using unnecessary type assertions and declarations can make your code brittle
    // Requiring more changes when the code changes.

    // Type assertions are usually only necessary when doing stuff like dealing
    // with dynamic data such as parsing JSON that came from user input
    const input: unknown = JSON.parse(`{ "breed": "Terrier"}`);
    // In situations like this you would normally use something like a Type Guard
    // to verify the type and then assert it
    // Here I verify this is not a primitive and use "in" as a Type Guard to 
    // verify that the input Object has the breed property
    if (input instanceof Object && "breed" in input) {
        const dog = input as Dog;
    }
}


function custom_type_guards() {
    // Type Guards are functions that return a boolean value
    // They use the "is" keyword to specify the type that they are guarding
    // They are used to verify that an object is of a specific type
    // They will narrow the type of an object
    function is_dog(input: any): input is Dog {
        return "breed" in input;
    }

    // unknown is the opposite of any in many ways
    // You will have to assert a type before you can access any properties
    const input: unknown = JSON.parse(`{ "breed": "Terrier"}`);
    if (is_dog(input)) {
        // Because we use a type guard to verify that input is of type Dog
        // Typescript knows that in this branch input is of type Dog
        // Above when using the "in" keyword we still had to assert the type
        let breed = input.breed;
    } else {
        let breed = input.breed;
    }
}


// ~~~~~~~~~ General Typescript and Javascript ~~~~~~~~~

function iteration_and_types() {
    let dogs: Array<Dog> = [{ breed: "Dalmation" }, { breed: "Poodle" }];
    for (let dog of dogs) {
        // dog is of type Dog
        console.log(dog.breed);
    }

    while (dogs.length) {
        // dog is of type Dog or undefined as the array can be empty
        // this style of iteration requires a type assertion or the use
        // of a type guard
        const dog = dogs.pop()
        console.log(dog.breed);
    }
}

function optional_chaining() {
    const nested = JSON.parse('{"object":{"property":"value"}}');

    // When working with an object thay may or may not have a property in some 
    // nested object we had to check to see if there was a value before accessing
    console.log(nested && nested.object && nested.object.property ? nested.object.property : "property not found");

    // Javascript now has an optional chaining operator that can be used
    // It will return undefined if it encounters a null or undefined value
    // while traversing the object tree to the property you are trying to access
    console.log(nested?.other?.property ? nested.object.property : "property not found");
}

function null_and_undefined() {
    let count: number | null | undefined;

    console.log(count);

    function get_count() {
        // Some error happened! What value can we use to indicate that?
        return null;
    }

    // When only using undefined for undefined values
    // It leaves null as a value that can be used to indicate an error
    count = get_count();
}

function typescript_javascript_runtime_example() {
    const car = {} as Car;
    // While the Typescript type says that car has the property make
    // This is not true at runtime. The assertion above just told the Typescript
    // compiler that this object has the make property
    // The Typescript types though are removed in the compilation type and do not
    // guarantee that objects at runtime will contain any specific value
    console.log(`car: ${Object.keys(car)}`);
}




function mapped_types() {

    // Mapped types are types that are generated from other types
    // Typescript comes with a number of powerful "utility types" to create these
    // https://www.typescriptlang.org/docs/handbook/utility-types.html

    const users = [{ username: "brad", password: "supersecret" }, { username: "other_person", password: "alsosecret" }];
    function get_user(password: string) {
        const user = users.find(user => user.password === password);
        if (user) {
            const without_password = _.omit(user, "password");


            // I am using the underscore library here and I am using 
            // the underscore types
            // The underscore types use the Utility types so that the types match
            // the runtime values I am working with

            // The type of without_password is now:
            // const without_password: Pick<{
            //     username: string;
            //     password: string;
            // }, "username"> = { username: "test" };
            //
            // Which is the same as:
            // const without_password2: Omit<{
            //     username: string;
            //     password: string;
            // }, "password"> = { username: "test" };
            //

            return without_password;
        } else {
            return undefined;
        }
    }

    const user = get_user("supersecret");
    // Use optional chaining as well:
    console.log(user?.username);

}






class Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    speak() {
        console.log(`${this.name} makes a noise.`);
    }
}

class Dog extends Animal {
    constructor(name: string) {
        super(name); // call the super class constructor and pass in the name parameter
    }

    speak() {
        console.log(`${this.name} barks.`);
    }
}

const d = new Dog('Mitzie');

function typeof_instanceof_javascript_typescript() {
    // Javascript has the typeof and instanceof operators
    // Typeof will return the type of a value as a string
    typeof d === 'object'

    // instanceof will search the proptotype chain for a constructor of the type
    // you specified
    // In classic object oriented programming terms:
    // we can think of this as checking if an object extends some class
    d instanceof Animal === true
    d instanceof Dog === true

    // Now with Typescript this gets a little more confusing as Typescript adds 
    // its own implementations of the typeof operator
    // The easy way to tell which one you are using is if the operator is being
    // used in a declaration or not. If it is on the right side of an assignment
    // it is probably Javascript's implementation, otherwise it is Typescript's
    // implementation

    function get_dog() {
        return d;
    }

    // For example, the Typescript usage:
    const animal1: typeof d = d;

    // How is this useful?:
    const animal2: ReturnType<typeof get_dog> = get_dog();
}



// Other topics:
// Tuples
// Any vs unkown
// Interfaces vs types