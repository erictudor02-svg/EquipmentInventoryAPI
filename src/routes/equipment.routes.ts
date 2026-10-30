import { Router } from "express";
import { EquipmentController } from "../controllers/equipment.controller";
import { ApiError } from "../errors/api-error";

const router = Router();
const controller = new EquipmentController();

// Require JSON for requests that create or update equipment.
router.use((req, _res, next) => {
  if (
    (req.method === "POST" || req.method === "PUT") &&
    !req.is("application/json")
  ) {
    next(
      new ApiError(
        415,
        "UNSUPPORTED_MEDIA_TYPE",
        "Content-Type must be application/json."
      )
    );
    return;
  }

  next();
});

router.get("/", controller.findAll);
router.get("/:id", controller.findById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;