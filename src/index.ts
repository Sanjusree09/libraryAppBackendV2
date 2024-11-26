import express,{Request, Response, NextFunction, response} from 'express';
import { AppDataSource } from './data-source';
import { AddBook } from './entity/addBooks';
import "reflect-metadata";
import cors from 'cors';
import jetitid, { generateID } from '@jetit/id';
import { AddMember } from './entity/addMember';
import { AddRegistry } from './entity/addRegistry';
import { AddAdmin } from './entity/addAdmin';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
const port = 3600;

app.use(express.json());

app.post('/addBooks', async (req: Request, res: Response, next: NextFunction) => {
  const { title, author, quantity, edition, description } = req.body;
  const bookId = generateID('HEX');

  const book = new AddBook();
  book.id = bookId;
  book.title = title;
  book.author = author;
  book.quantity = quantity;
  book.edition = edition;
  book.description = description;

  try {
    
    await AppDataSource.manager.save(book);

    res.status(201).json({
      message: 'Book added successfully',
      book,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error saving book',
      error: error.message,
    });
  }
});

 

  app.get('/getBooks/:id',  async(req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;  
    console.log(`Fetching book with id: ${id}`);
   
  
    try {
      
      const book =  await AppDataSource.manager.findOne(AddBook, {
        where: { id: id },  
      });
      
    
      if (!book) {
         res.status(404).json({
          message: 'Book not found',
        });
      }
      res.status(200).json({
        message: 'Book retrieved successfully',
        book, 
      });

  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error retrieving book',
        error: error.message
      });
    }
  
    next();
  });


app.put('/updateBooks/:id', async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const bookId = req.params.id;  
  const { title, author, quantity, edition, description } = req.body;

  if (!title || !author || !quantity || !edition || !description) {
     res.status(400).json({ message: 'Missing required fields' });
  }

  try {

    const book = await AppDataSource.manager.findOne(AddBook, { where: { id: bookId } });

    if (!book) {
       res.status(404).json({ message: 'Book not found' });
    }

    book.title = title;
    book.author = author;
    book.quantity = quantity;
    book.edition = edition;
    book.description = description;

  
    await AppDataSource.manager.save(book);

    
     res.status(200).json({
      message: 'Book updated successfully',
      book,
    });
    
  } catch (error) {
 
    console.error('Error updating book:', error);
     res.status(500).json({
      message: 'Error updating book',
      error: error.message || error,
    });
  }
});

const JWT_SECRET_KEY = 'your-secret-key';

app.post('/admin/Signup', async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, role } = req.body;
  const adminJetId = generateID('HEX');  
 
  const adminRegister = new AddAdmin();
  adminRegister.id = adminJetId;
  adminRegister.name = name;
  adminRegister.email = email;
  adminRegister.role = role;

  try {
    
    await AppDataSource.manager.save(adminRegister);

    const token = jwt.sign(
      { id: adminRegister.id, email: adminRegister.email, role: adminRegister.role }, JWT_SECRET_KEY, { expiresIn: '1h' } 
    );

    res.status(201).json({
      message: 'Admin added successfully',
      admin: adminRegister,
      token 
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving admin', error });
  }

  next();
});

app.post('/admin/login', async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const { email } = req.body;

  try {
    const admin = await AppDataSource.manager.findOne(AddAdmin, { where: { email } });

    if (!admin) {
       res.status(404).json({ message: 'Admin not found' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },JWT_SECRET_KEY,{ expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during login', error });
  }

  next();
});




  app.get('/admin/getAdmin/:adminId',  async(req: Request, res: Response, next: NextFunction) => {
    const id = req.params.adminId;  
    console.log(`Fetching book with id: ${id}`);
  
    try {
      
      const admin =  await AppDataSource.manager.findOne(AddAdmin, {
        where: { id: id },  
      });
      if (!admin) {
         res.status(404).json({
          message: 'Admin not found',
        });
      }
      res.status(200).json({
        message: 'Admin Details retrieved successfully',
        admin, 
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error retrieving book',
        error: error.message
      });
    }
  
    next();
  });
  
  app.post('/member/Signup', async (req: Request, res: Response, next: NextFunction) => {
    const { memberName, memberEmail, memberContactNumber, memberAddress, memberOccupation } = req.body;
    const memberId = generateID('HEX');
    
    const memberRegister = new AddMember();
    memberRegister.id = memberId;
    memberRegister.memberName = memberName;
    memberRegister.memberEmail = memberEmail;
    memberRegister.memberContactNumber = memberContactNumber;
    memberRegister.memberAddress = memberAddress;
    memberRegister.memberOccupation = memberOccupation;
  
    try {
    
      await AppDataSource.manager.save(memberRegister);
      res.status(201).json({
        message: 'Member added successfully',
        memberId: memberRegister.id,  
        memberRegister
      });
    } catch (error) {
      res.status(500).json({ message: 'Error saving Member', error });
    }
    next();
    //console.log(memberId);
  });
  
  
app.get('/getMember/:id', async(req:Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  console.log(`Fetching Members by id:`, id);

  try{
    const member = await AppDataSource.manager.findOne(AddMember, {
      where:{id:id}
    });
    if(!member){
      res.send(404).json({
        message:'Member not found',
        
      })
    }
    res.json({
      message:'Member retrieved Successfully',
      member

    })
  } catch(error){
    console.log('Error to fetch member details', error);

  }

})

app.put('/updateMember/:id', async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const memberId = req.params.id;  
  const { updateMemberName, updateMemberEmail, updateMemberContactNumber, updateMemberAddress, updateMemberOccupation } = req.body;

  if (!updateMemberName || !updateMemberEmail || !updateMemberContactNumber || !updateMemberAddress || !updateMemberOccupation ) {
     res.status(400).json({ message: 'Missing required fields' });
  }

  try {

    const member = await AppDataSource.manager.findOne(AddMember, { where: { id: memberId } });

    if (!member) {
       res.status(404).json({ message: 'Member not found' });
    }

    member.memberName = updateMemberName;
    member.memberEmail = updateMemberEmail;
    member.memberContactNumber = updateMemberContactNumber;
    member.memberAddress = updateMemberAddress;
    member.memberOccupation = updateMemberOccupation;

  
    await AppDataSource.manager.save(member);

    
     res.status(200).json({
      message: 'Member updated successfully',
      member,
    });
    
  } catch (error) {
 
    console.error('Error updating member:', error);
     res.status(500).json({
      message: 'Error updating member',
      error: error.message || error,
    });
  }
});


app.post('/addRegistry', async (req: Request, res: Response, next: NextFunction) => {
  const { borrowerName, registryTitle, registryAuthor, registryQuantity, registryEdition, registryBorrowedDate, registryReturnDate } = req.body;
  const registryId = generateID('HEX'); 

  const registry = new AddRegistry();
  registry.id = registryId;
  registry.borrowerName = borrowerName;
  registry.registryTitle = registryTitle;
  registry.registryAuthor = registryAuthor;
  registry.registryQuantity = registryQuantity;
  registry.registryEdition = registryEdition;
  registry.registryBorrowedDate = registryBorrowedDate;
  registry.registryReturnDate = registryReturnDate;

  try {
    await AppDataSource.manager.save(registry);
    console.log("Generated registryId:", registry.id);
    res.status(201).json({
      message: 'Registry added successfully',
      registryId: registry.id,  
      registry: registry
    });

  } catch (error) {
    res.status(500).json({ message: 'Error saving Registry', error });
  }
  next();
});

  app.get('/getRegistry/:id', async(req: Request, res:Response, next:NextFunction)=>{
    const id = req.params.id;
    console.log(`Fetching registry by book Id`);

    try{
      const registry = await AppDataSource.manager.findOne(AddRegistry, {
        where:{id:id},
      });
      if(!registry){
        res.json({
          message:'Registry not found',
        })
      }
      res.json({
        message:'Registry retrieved successfully',
        registry
      })
    } catch(error){
      console.log('Error to fetch registry',error);
    }
  })


  app.put('/updateRegistry/:id', async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    const registryId = req.params.id;  
    const { updateBorrowedName, updateRegistryTitle, updateRegistryAuthor, updateRegistryQuantity, updateRegistryEdition, updateRegistryBorrowedDate, updateRegistryReturnDate } = req.body;
  
  
    try {
  
      const registry = await AppDataSource.manager.findOne(AddRegistry, { where: { id: registryId } });
  
      if (!registry) {
         res.status(404).json({ message: 'Registry not found' });
      }
  
      registry.borrowerName = updateBorrowedName;
      registry.registryTitle = updateRegistryTitle;
      registry.registryAuthor = updateRegistryAuthor;
      registry.registryQuantity = updateRegistryQuantity;
      registry.registryEdition = updateRegistryEdition;
      registry.registryBorrowedDate = updateRegistryBorrowedDate;
      registry.registryReturnDate = updateRegistryReturnDate
  
    
      await AppDataSource.manager.save(registry);
  
      
       res.status(200).json({
        message: 'Registry updated successfully',
        registry,
      });
      
    } catch (error) {
   
      console.error('Error updating Registry:', error);
       res.status(500).json({
        message: 'Error updating Registry',
        error: error.message || error,
      });
    }
  });
  
    

  
  app.listen(port, () => {
    AppDataSource.initialize()
    console.log(`Server is running at http://localhost:${port}`);
  });

